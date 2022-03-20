import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global } from '../../utils/global';
import style from '../../utils/style';
import { debug } from '../../utils/debug';
import onPage from '../../utils/onPage';
import * as hover from '../../utils/hover';
import each from '../../utils/each';
import * as userInfo from '../../utils/user';
import find from '../../utils/find';
import merge from '../../utils/merge';

/* eslint-disable no-use-before-define */
settings.register({
  name: 'Disable Battle Log',
  key: 'underscript.disable.logger',
  page: 'Game',
  onChange: (to, from) => {
    if (!onPage('Game') && !onPage('Spectate')) return;
    if (to) {
      $('#history').hide();
    } else {
      $('#history').show();
    }
  },
});

settings.register({
  name: 'Hide Dust Counter',
  key: 'underscript.disable.dust',
  type: 'select',
  default: 'always',
  options: ['never', 'playing', 'spectating', 'always'],
  page: 'Game',
});

settings.register({
  name: 'Dust Counter Location',
  key: 'underscript.dust.location',
  type: 'select',
  options: [],
  disabled: true,
  hidden: true,
  page: 'Game',
});

eventManager.on('GameStart', function battleLogger() {
  const ignoreEvents = Object.keys({
    getEmote: 'Player is using emote',
    getConnectedFirst: '',
    refreshTimer: 'Never need to know about this one',
    getPlayableCards: 'On turn start, selects cards player can play',
    getTurn: 'Turn update',
    getCardDrawed: 'Add card to your hand',
    updateSpell: '',
    getFakeDeath: 'Card "died" and respawns 1 second later',
    getMonsterTemp: 'You\'re about to play a monster',
    getSpellTemp: 'You\'re about to play a spell',
    getTempCancel: 'Temp card cancelled',
    getShowMulligan: 'Switching out hands, ignore it',
    getHideMulligan: 'Hide the mulligan, gets called twice',
    getUpdateHand: 'Updates full hand',
    getError: 'Takes you to "home" on errors, can be turned into a toast',
    getGameError: 'Takes you to "play" on game errors, can be turned into a toast',
    getBattleLog: 'In-game battle log',
    getBotDelay: '...',
    clearSpell: '',
    getPlaySound: '',
    getAnimation: '',
    getArtifactDoingEffect: 'artifact activates, handled by getBattleLog',
  });
  const turnText = '>>> Turn';
  const surrendered = 'surrendered';
  const overwhelmed = 'was overwhelmed';
  let baseLives = 1;
  let turn = 0;
  let currentTurn = 0;
  const players = {};
  let monsters = {};
  let lastEffect;
  const other = {};
  let yourDust;
  let enemyDust;
  let lastSP;
  function addDust(player) {
    if (!player || !players[player]) return;
    const display = player === global('userId') ? yourDust : enemyDust;
    const dust = typeof players[player].dust === 'undefined' ? players[player].dust = 0 : players[player].dust += 1;
    display.html(dust);
  }
  const make = {
    player: function makePlayer(player, title = false) {
      const c = $('<span>');
      c.append(`<img src="images/souls/${player.class}.png">`, userInfo.name(player));
      c.addClass(player.class);
      if (!title) {
        c.css('text-decoration', 'underline');
        // show lives, show health, show gold, show hand, possibly deck size as well
        const data = `${player.hp} hp, ${player.gold} gold<br />${player.dust} dust`;
        c.hover(hover.show(data, '2px solid white'));
      }
      return c;
    },
    card: function makeCard(card) {
      const c = $('<span>');
      c.append(card.name);
      c.css('text-decoration', 'underline');

      const d = $('<div>');
      const appendCard = global('appendCard');
      try {
        appendCard(card, d);
      } catch (e) { // if he ever decides to switch it again.......
        appendCard(d, card);
      }
      c.hover(hover.show(d));
      return c;
    },
    artifact(art, appendName) {
      const c = $('<span>');
      c.append(`<img src="images/artifacts/${art.image}.png">`);
      if (appendName) {
        c.append(art.name);
      }
      return c;
    },
  };

  eventManager.on('connect', function initBattle(data) {
    debug(data, 'debugging.raw.game');
    const you = JSON.parse(data.you);
    const enemy = JSON.parse(data.enemy);
    // Set gold
    const gold = JSON.parse(data.golds);
    you.gold = gold[you.id];
    enemy.gold = gold[enemy.id];
    // populate monsters
    JSON.parse(data.board).forEach((card, i) => {
      if (card === null) return;
      // id, attack, hp, maxHp, originalattack, originalHp, typeCard, name, image, cost, originalCost, rarity, shiny, quantity
      card.owner = i < 4 ? enemy.id : you.id;
      monsters[card.id] = card;
    });
    you.level = data.yourLevel;
    you.class = data.yourSoul;
    you.rank = data.yourRank;
    enemy.level = data.enemyLevel;
    enemy.class = data.enemySoul;
    enemy.rank = data.enemyRank;
    // yourArtifacts, yourAvatar {id, image, name, rarity, ucpCost}, division, oldDivision, profileSkin {id, name, image, ucpCost}
    debug({ you, enemy }, 'debugging.game');
    turn = data.turn || 0;
    players[you.id] = you;
    players[enemy.id] = enemy;
    // Display Dust
    const disableDust = settings.value('underscript.disable.dust');
    yourDust = $('<span>');
    enemyDust = $('<span>');
    if (disableDust === 'never' || (disableDust !== 'always' && disableDust !== (this.event === 'getAllGameInfos' ? 'spectating' : 'playing'))) {
      const dustImg = $('<img style="width: 20px; height: 16px;" title="Number of cards turned to dust." src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAZElEQVQ4jb2UUQ7AIAhDqfH+V95+NDEdrMSg/UQqr5hoFugZytanWnSwq+4RZIyzDwDW+jnCLBmLSSUhD+KIH8JdsmiwJGQiBVD+KOU7vE9YukMv3vXIMPNjKBLpUd/S38Wr7wVZPk/6kF1cXAAAAABJRU5ErkJggg==">');
      $('.rightPart').append(dustImg, ' ');
      $(`#user${global('opponentId')} .rightPart`).append(enemyDust, ' ');
      const userId = global('userId');
      $(`#user${userId} .rightPart`).append(yourDust, ' ', $(`#user${userId} .rightPart > button:last`));
    }
    // Set lives
    if (data.lives) {
      const lives = JSON.parse(data.lives);
      you.lives = lives[you.id];
      enemy.lives = lives[enemy.id];
    } else {
      baseLives = 0;
      updateSoul({
        idPlayer: you.id,
        soul: you.soul,
      });
      updateSoul({
        idPlayer: enemy.id,
        soul: enemy.soul,
      });
    }
    addDust(you.id);
    addDust(enemy.id);
    // Test changing ID's at endTurn instead of startTurn
    other[you.id] = enemy.id;
    other[enemy.id] = you.id;
    // Initialize the log
    log.init();
    if (settings.value('underscript.disable.logger')) {
      $('#history').hide();
    }
    $('div#history div.handle').html('').append(`[${data.gameType}] `, make.player(you), ' vs ', make.player(enemy));
    log.add(`${turnText} ${turn}`);
    if (data.userTurn) {
      currentTurn = data.userTurn;
      log.add(make.player(players[data.userTurn]), '\'s turn');
    }
  });
  eventManager.on('getFight getFightPlayer', function fight(data) {
    const target = this.event === 'getFightPlayer' ? make.player(players[data.defendPlayer]) : make.card(monsters[data.defendMonster]);
    log.add(make.card(monsters[data.attackMonster]), ' attacked ', target);
  });
  eventManager.on('getUpdatePlayerHp', function updateHP(data) {
    debug(data, 'debugging.raw.updateHP');
    const player = players[data.playerId];
    const oHp = player.hp;
    player.hp = data.hp;
    if (oHp !== data.hp) { // If the player isn't at 0 hp already
      const hp = data.hp - oHp;
      log.add(make.player(player), ` ${hp < 0 ? 'lost' : 'gained'} ${Math.abs(hp)} hp`);
    }
    // eslint-disable-next-line no-prototype-builtins
    if (data.hp === 0 && player.lives > baseLives && player.lostLife !== true) { // If they have extra lives, and they didn't lose a life already
      log.add(make.player(player), ' lost a life');
      player.lostLife = true;
    }
  });
  eventManager.on('getDoingEffect', function doEffect(data) {
    debug(data, 'debugging.raw.effect');
    if (data.card) {
      const card = JSON.parse(data.card);
      monsters[card.id] = card;
      data.monsterId = card.id;
    }
    // affecteds: [ids]; monsters affected
    // playerAffected1: id; player affected
    // playerAffected2: id; player affected
    // TODO: Figure out how to do this better
    if (lastEffect === `m${data.monsterId}`) return;
    lastEffect = `m${data.monsterId}`;
    log.add(make.card(monsters[data.monsterId]), '\'s effect activated');
  });
  eventManager.on('Log:ARTIFACT_EFFECT', ({ artifactActor: artifact, playerId, targetCards = [], targetPlayers = [] }) => {
    const bits = [make.player(players[playerId]), `'s `, make.artifact(artifact, true), ' activated', ...targets(targetCards, targetPlayers)];
    log.add(...bits);
  });
  eventManager.on('Log:SOUL_EFFECT', ({ playerActor, playerId, targetCards = [], targetPlayers = [] }) => {
    const bits = [
      make.player(players[playerId]),
      `'s soul activated`,
      ...targets(targetCards, targetPlayers),
    ];
    log.add(...bits);
  });
  function targets(targetCards = [], targetPlayers = []) {
    if (!targetCards.length && !targetPlayers.length) return [];
    const bits = [' on '];
    targetCards.forEach((card, i) => {
      if (i) bits.push(', ');
      bits.push(make.card(card));
    });
    targetPlayers.forEach((player, i) => {
      if (i || targetCards.length) bits.push(', ');
      bits.push(make.player(players[player.id]));
    });
    if (bits.length > 2) { // Convert , to and
      bits[bits.length - 2] = ' and ';
    }
    return bits;
  }
  eventManager.on('getTurnStart', function turnStart(data) {
    debug(data, 'debugging.raw.turnStart');
    lastEffect = 0;
    if (data.numTurn !== turn) {
      turn = data.numTurn;
      log.add(`${turnText} ${turn}`);
    }
    if (currentTurn !== data.idPlayer) {
      currentTurn = data.idPlayer; // It would (kindof) help to actually update who's turn it is
      log.add(make.player(players[currentTurn]), '\'s turn');
    }
  });
  eventManager.on('getTurnEnd', function turnEnd(data) {
    debug(data, 'debugging.raw.turnEnd');
    // Lets switch the turn NOW, rather than later, the purpose of this is currently unknown... It just sounded like a good idea, also delete the "lostLife" flag...
    if (global('time') <= 0) {
      log.add(make.player(players[data.idPlayer]), ' timed out');
    }
    delete players[data.idPlayer].lostLife;
    delete players[other[data.idPlayer]].lostLife;
    lastEffect = 0;
    lastSP = 0;
  });
  eventManager.on('getUpdateBoard', function updateGame(data) {
    debug(data, 'debugging.raw.boardUpdate');
    // const oldMonsters = monsters;
    monsters = {};
    // TOOD: stuff....
    JSON.parse(data.board).forEach((card, i) => {
      if (card === null) return;
      card.owner = global(i < 4 ? 'opponentId' : 'userId');
      monsters[card.id] = card;
    });
  });
  eventManager.on('updateMonster updateCard', function updateCard(data) {
    data.monster = JSON.parse(data.monster || data.card);
    debug(data, 'debugging.raw.updateMonster');
    const card = data.monster;
    monsters[card.id] = merge(monsters[card.id], card);
  });
  eventManager.on('getMonsterDestroyed', function monsterKilled(data) {
    debug(data, 'debugging.raw.kill');
    // monsterId: #
    log.add(make.card(monsters[data.monsterId]), ' was killed');
    addDust(monsters[data.monsterId].owner);
    delete monsters[data.monsterId];
  });
  eventManager.on('getCardBoard getMonsterPlayed', function playCard(data) { // Adds card to X, Y (0(enemy), 1(you))
    debug(data, 'debugging.raw.boardAdd');
    const card = JSON.parse(data.card);
    card.owner = data.idPlayer;
    monsters[card.id] = card;
    log.add(make.player(players[data.idPlayer]), ' played ', make.card(card));
  });
  eventManager.on('getSpellPlayed', function useSpell(data) {
    debug(data, 'debugging.raw.spell');
    // immediately calls "getDoingEffect" and "getUpdateBoard"
    const card = JSON.parse(data.card);
    if (lastSP === card.id) return;
    lastSP = card.id;
    card.owner = data.idPlayer;
    monsters[card.id] = card;
    log.add(make.player(players[data.idPlayer]), ' used ', make.card(card));
  });
  eventManager.on('getShowCard', function showCard(data) {
    const card = JSON.parse(data.card);
    log.add(make.player(players[data.idPlayer]), ' exposed ', make.card(card));
  });
  eventManager.on('getCardDestroyedHandFull', function destroyCard(data) {
    debug(data, 'debugging.raw.fullHand');
    const card = JSON.parse(data.card);
    debug(data.card, 'debugging.destroyed.card');
    log.add(make.player(players[data.idPlayer || card.ownerId]), ' discarded ', make.card(card));
  });
  eventManager.on('getPlayersStats', function updatePlayer(data) { // TODO: When does this get called?
    debug(data, 'debugging.raw.stats');
    let temp = JSON.parse(data.handsSize);
    Object.keys(temp).forEach((key) => {
      // TODO: hand size monitoring
      // players[key].hand
    });
    // TODO: deck monitoring (decksSize)
    temp = JSON.parse(data.golds);
    Object.keys(temp).forEach((key) => {
      players[key].gold = temp[key];
    });
    if (data.lives) {
      temp = JSON.parse(data.lives);
      Object.keys(temp).forEach((key) => {
        players[key].lives = temp[key];
      });
    }
    // data.artifacts
    if (data.artifacts) {
      temp = JSON.parse(data.artifacts);
      each(temp, (array = [], user = 0) => {
        players[user].overwhelmed = array.some((art) => art.id === 34 && art.custom === 0);
      });
    }
    // data.turn
  });
  eventManager.on('getVictory getDefeat', function gameEnd(data) {
    debug(data, 'debugging.raw.end');
    const userId = global('userId');
    const opponentId = global('opponentId');
    const you = make.player(players[userId]);
    const enemy = make.player(players[opponentId]);
    if (this.event === 'getDefeat') {
      const player = players[userId];
      if (player.overwhelmed) {
        log.add(you.clone(), ` ${overwhelmed}.`);
      } else if (player.hp > 0 && player.maxHp > 0) {
        log.add(you.clone(), ` ${surrendered}.`);
      }
      log.add(enemy, ' beat ', you);
      return;
    }
    if (data.disconnected) {
      log.add(enemy.clone(), ' left the game.');
    } else if (players[opponentId].hp > 0 && players[opponentId].maxHp > 0) {
      const msg = players[opponentId].overwhelmed ? overwhelmed : surrendered;
      log.add(enemy.clone(), ` ${msg}.`);
    }
    log.add(you, ' beat ', enemy);
  });
  eventManager.on('getResult', function endSpectating(data) {
    debug(data, 'debugging.raw.end');
    const loser = lookupPlayer(data.looser);
    let loseReason = '';
    if (data.cause === 'game-end-surrender') {
      loseReason = surrendered;
    } else if (data.cause === 'game-end-disconnection') {
      loseReason = 'left the game';
    } else if (loser.overwhelmed) {
      loseReason = overwhelmed;
    }
    const lost = make.player(loser);
    if (loseReason) {
      log.add(lost.clone(), ` ${loseReason}.`);
    }
    if (typeof music !== 'undefined') {
      global('music').addEventListener('playing', () => {
        if (localStorage.getItem('gameMusicDisabled')) {
          global('music').pause();
        }
      });
    }
    const winner = lookupPlayer(data.winner);
    log.add(make.player(winner), ` beat `, lost);
  });
  eventManager.on(ignoreEvents.join(' '), function ignore(data) {
    debug(data, 'debugging.raw.ignore');
    debug(data, `debugging.raw.ignore.${this.event}`);
  });
  eventManager.on('getUpdateSoul', function blah(data) {
    updateSoul({
      idPlayer: data.idPlayer,
      soul: JSON.parse(data.soul),
    });
  });

  function updateSoul({ idPlayer, soul = {} }) {
    const player = players[idPlayer];
    player.lives = soul.lives || 0;
    player.dodge = soul.dodge || 0;
  }

  function lookupPlayer(name) { // This is undefined
    return find(players, (player) => userInfo.name(player) === name);
  }

  style.add(
    '#history { border: 2px solid white; background-color: rgba(0,0,0,0.9); position: absolute; right: 10px; top: 10px; z-index: 20; user-select: text; }',
    '#history .handle { border-bottom: 1px solid white; text-align: center; }',
    '#history #log { display: flex; flex-direction: column-reverse; align-items: flex-start; overflow-y: auto; max-height: 600px; }',
    '#history img { height: 16px; padding-right: 4px; }',
    '#history #log div { position: relative; width: 100% }',
    '#history #log div:after { content: ""; border-bottom: 1px dashed rgb(133,133,133); position: absolute; left: 0; right: 0; bottom: -1px; }',
  );

  const log = {
    init() {
      const hi = $('<div id=\'history\'></div>');
      const ha = $('<div class=\'handle\'>History</div>');
      const lo = $('<div id=\'log\'></div>');
      // Positional math -- not working anymore??
      const mainContent = $('div.mainContent');
      mainContent.css('position', 'initial');
      const pos = parseInt(mainContent.css('width'), 10) + parseInt(mainContent.css('margin-left'), 10);
      mainContent.css('position', '');
      hi.css({
        width: `${window.innerWidth - pos - 20}px`,
      });
      hi.append(ha);
      hi.append(lo);
      $('body').append(hi);
    },
    add(...args) {
      const div = $('<div>');
      args.forEach((a) => {
        if (a) div.append(a);
      });
      if (!div.html()) return;
      $('div#history div#log').prepend(div);
    },
  };
});
