settings.register({
  name: 'Disable Battle History',
  key: 'underscript.disable.logger',
  onChange: (to, from) => {
    if (!onPage('Game') && !onPage('gameSpectate')) return;
    if (to) {
      $('#history').hide();
    } else {
      $('#history').show();
    }
  },
});

eventManager.on("GameStart", function battleLogger() {
  const ignoreEvents = Object.keys({
    getConnectedFirst: '',
    refreshTimer: 'Never need to know about this one',
    getPlayableCards: 'On turn start, selects cards player can play',
    getTurn: 'Turn update',
    getCardDrawed: 'Add card to your hand',
    updateSpell: '',
    updateMonster: 'monster on board updated',
    getFakeDeath: 'Card "died" and respawns 1 second later',
    getMonsterTemp: "You're about to play a monster",
    getSpellTemp: "You're about to play a spell",
    getTempCancel: 'Temp card cancelled',
    getShowMulligan: 'Switching out hands, ignore it',
    getHideMulligan: 'Hide the mulligan, gets called twice',
    getUpdateHand: 'Updates full hand',
    getError: 'Takes you to "home" on errors, can be turned into a toast',
    getGameError: 'Takes you to "play" on game errors, can be turned into a toast',
  });
  let turn = 0, currentTurn = 0, players = {}, monsters = {}, lastEffect, other = {}, finished = false;
  const yourDust = $('<span>')
  const enemyDust = $('<span>');
  function addDust(player) {
    const display = player === userId ? yourDust : enemyDust;
    const dust = typeof players[player].dust === 'undefined' ? players[player].dust = 0 : players[player].dust += 1;
    display.html(dust);
  }
  const make = {
    player: function makePlayer(player, title = false) {
      const c = $('<span>');
      c.append(player.username);
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

      let data = `<table class="cardBoard ${card.paralyzed ? 'paralyzed' : ''}">`;
      data += `<tr><td class="cardName resize ${card.classe || card.class}" colspan="3">${card.name}`;
      if (card.shiny) {
        // TODO: rainbow
      }
      // TODO: skins
      data += `</td><td class="cardCost">${card.cost}</td></tr>`;
      data += `<tr><td id="cardImage" colspan="4">`;
      const status = fn.cardStatus(card);
      if (status.length) {
        // add status images
        status.forEach((s, i) => {
          data += `<img class="infoPowers" style="z-index:20;right:${4 + i * 20}px;" src="images/powers/${s}.png"/>`;
        });
      }
      data += `<img src="images/cards/${card.image}.png"/></td></tr>`;
      data += `<tr><td class="cardDesc" colspan="4">${card.desc || ''}`
      if (card.silence) {
        data += '<img class="silenced" title="Silence" src="images/silence.png">';
      }
      data += '</td></tr>';
      if (!card.typeCard) {
        data += `<tr><td id="cardATQ">${card.attack}</td><td id="cardRarity" colspan="2"><img src="images/rarity/${card.rarity}.png" /></td><td id="cardHP" class="${card.hp!==card.maxHp ? "damaged" : ""}">${card.hp}</td></tr>`;
      } else {
        data += `<tr><td id="cardRarity" colspan="4"><img src="images/rarity/${card.rarity}.png" /></td></tr>`;
      }
      data += `</table>`;
      c.hover(hover.show(data));
      return c;
    },
  };

  eventManager.on('GameEvent', function logEvent(data) {
    if (finished) { // Sometimes we get events after the battle is over
      fn.debug(`Extra action: ${data.action}`, 'debugging.events.extra');
      return;
    }
    debug(data.action, 'debugging.events.name');
    const emitted = eventManager.emit(data.action, data).ran;
    if (!emitted) {
      fn.debug(`Unknown action: ${data.action}`);
    }
  });

  eventManager.on('getAllGameInfos getGameStarted getReconnection', function initBattle(data) {
    debug(data, 'debugging.raw.game');
    let you, enemy;
    // Battle logging happens after the game runs
    if (this.event === 'getGameStarted') {
      you = {
        id: data.yourId,
        username: data.yourUsername,
        hp: 30, // This is wrong with artifacts? Maybe?
        gold: 2, // This is wrong with artifacts? Maybe?
      };
      enemy = {
        id: data.enemyId,
        username: data.enemyUsername,
        hp: 30, // This is wrong with artifacts? Maybe?
        gold: 2, // This is wrong with artifacts? Maybe?
      };
    } else {
      you = JSON.parse(data.you);
      enemy = JSON.parse(data.enemy);
      // Set gold
      const gold = JSON.parse(data.golds);
      you.gold = gold[you.id];
      enemy.gold = gold[enemy.id];
      // Set lives
      const lives = JSON.parse(data.lives);
      you.lives = lives[you.id];
      enemy.lives = lives[enemy.id];
      // populate monsters
      let count = 0;
      JSON.parse(data.board).forEach(function (card) {
        count += 1;
        if (card === null) return;
        // id, attack, hp, maxHp, originalattack, originalHp, typeCard, name, image, cost, originalCost, rarity, shiny, quantity
        card.desc = getDescription(card);
        card.owner = count <= 4 ? enemy.id : you.id;
        monsters[card.id] = card;
      });
    }
    you.level = data.yourLevel;
    you.class = data.yourClass;
    you.rank = data.yourRank;
    enemy.level = data.enemyLevel;
    enemy.class = data.enemyClass;
    enemy.rank = data.enemyRank;
    // yourArtifacts, yourAvatar {id, image, name, rarity, ucpCost}, division, oldDivision, profileSkin {id, name, image, ucpCost}
    debug({you, enemy}, 'debugging.game');
    turn = data.turn || 0;
    players[you.id] = you;
    players[enemy.id] = enemy;
    const dustImg = $('<img style="width: 20px; height: 16px;" title="Number of cards turned to dust." src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAAZElEQVQ4jb2UUQ7AIAhDqfH+V95+NDEdrMSg/UQqr5hoFugZytanWnSwq+4RZIyzDwDW+jnCLBmLSSUhD+KIH8JdsmiwJGQiBVD+KOU7vE9YukMv3vXIMPNjKBLpUd/S38Wr7wVZPk/6kF1cXAAAAABJRU5ErkJggg==">');
    $('.rightPart').append(dustImg, ' ');
    $(`#user${opponentId} .rightPart`).append(enemyDust, ' ');
    $(`#user${userId} .rightPart`).append(yourDust, ' ', $(`#user${userId} .rightPart > button:last`));
    addDust(you.id);
    addDust(enemy.id);
    // Test changing ID's at endTurn instead of startTurn
    other[you.id] = enemy.id;
    other[enemy.id] = you.id;
    // Initialize the log
    log.init();
    if (localStorage.getItem('underscript.disable.logger')) {
      $('#history').hide();
    }
    $("div#history div.handle").html('').append(`[${data.gameType}] `, make.player(you), ' vs ', make.player(enemy));
    log.add(`Turn ${turn}`);
    if (data.userTurn) {
      currentTurn = data.userTurn;
      log.add(make.player(players[data.userTurn]), "'s turn");
    }
  });
  eventManager.on('getFight getFightPlayer', function fight(data) {
    const target = this.event === 'getFightPlayer' ? make.player(players[data.defendPlayer]) : make.card(monsters[data.defendMonster]);
    log.add(make.card(monsters[data.attackMonster]), ' attacked ', target);
  });
  eventManager.on('getUpdatePlayerHp', function updateHP(data) {
    debug(data, 'debugging.raw.updateHP');
    const oHp = players[data.playerId].hp;
    const hp = data.isDamage ? oHp - data.hp : data.hp - oHp;
    players[data.playerId].hp = data.hp;
    if (oHp !== data.hp) { // If the player isn't at 0 hp already
      log.add(make.player(players[data.playerId]), ` ${data.isDamage ? "lost" : "gained"} ${hp} hp`);
    }
    if (data.hp === 0 && players[data.playerId].lives > 1 && !players[data.playerId].hasOwnProperty("lostLife")) { // If they have extra lives, and they didn't lose a life already
      log.add(make.player(players[data.playerId]), ' lost a life');
      players[data.playerId].lostLife = true;
    }
  });
  eventManager.on('getDoingEffect', function doEffect(data) {
    debug(data, 'debugging.raw.effect');
    // affecteds: [ids]; monsters affected
    // playerAffected1: id; player affected
    // playerAffected2: id; player affected
    // TODO: Figure out how to do this better
    if (lastEffect === 'm' + data.monsterId) return;
    lastEffect = 'm' + data.monsterId;
    log.add(make.card(monsters[data.monsterId]), "'s effect activated");
  });
  eventManager.on('getArtifactDoingEffect', function doEffect(data) {
    debug(data, 'debugging.raw.effectArtifact');
    if (lastEffect === 'a' + data.playerId) return;
    lastEffect = 'a' + data.playerId;
    log.add(make.player(players[data.playerId]), "'s artifact activated");
  });
  eventManager.on('getSoulDoingEffect', function soulEffect(data) {
    debug(data, 'debugging.raw.effectSoul');
    if (lastEffect === 's' + data.playerId) return;
    lastEffect = 's' + data.playerId;
    log.add(make.player(players[data.playerId]), "'s soul activated");
    // affecteds
    // playerAffected1
    // playerAffected2
  });
  eventManager.on('getTurnStart', function turnStart(data) {
    debug(data, 'debugging.raw.turnStart');
    lastEffect = 0;
    if (data.numTurn !== turn) {
      log.add(`Turn ${data.numTurn}`);
    }
    currentTurn = data.idPlayer; // It would (kindof) help to actually update who's turn it is
    turn = data.numTurn;
    log.add(make.player(players[currentTurn]), "'s turn");
  });
  eventManager.on('getTurnEnd', function turnEnd(data) {
    debug(data, 'debugging.raw.turnEnd');
    // Lets switch the turn NOW, rather than later, the purpose of this is currently unknown... It just sounded like a good idea, also delete the "lostLife" flag...
    if (time <= 0) {
      log.add(make.player(players[currentTurn]), ' timed out');
    }
    delete players[currentTurn].lostLife;
    currentTurn = other[data.idPlayer];
    delete players[currentTurn].lostLife;
    lastEffect = 0;
  });
  eventManager.on('getUpdateBoard', function updateGame(data) {
    debug(data, 'debugging.raw.boardUpdate');
    const oldMonsters = monsters;
    monsters = {};
    // TOOD: stuff....
    let count = 0;
    JSON.parse(data.board).forEach(function (card) {
      count += 1;
      if (card === null) return;
      card.desc = getDescription(card);
      card.owner = count <= 4 ? opponentId : userId;
      monsters[card.id] = card;
    });
  });
  eventManager.on('getMonsterDestroyed', function monsterKilled(data) {
    debug(data, 'debugging.raw.kill');
    // monsterId: #
    log.add(make.card(monsters[data.monsterId]), ' was killed');
    addDust(monsters[data.monsterId].owner);
    delete monsters[data.monsterId];
  });
  eventManager.on('getCardBoard', function playCard(data) { // Adds card to X, Y (0(enemy), 1(you))
    debug(data, 'debugging.raw.boardAdd');
    const card = JSON.parse(data.card);
    card.desc = getDescription(card);
    card.owner = data.idPlayer;
    monsters[card.id] = card;
    log.add(make.player(players[data.idPlayer]), ' played ', make.card(card));
  });
  eventManager.on('getSpellPlayed', function useSpell(data) {
    debug(data, 'debugging.raw.spell');
    // immediately calls "getDoingEffect" and "getUpdateBoard"
    const card = JSON.parse(data.card);
    card.desc = getDescription(card);
    monsters[card.id] = card;
    log.add(make.player(players[data.idPlayer]), ' used ', make.card(card));
  });
  eventManager.on('getShowCard', function showCard(data) {
    const card = JSON.parse(data.card);
    card.desc = getDescription(card);
    log.add(make.player(players[data.idPlayer]), ' exposed ', make.card(card));
  });
  eventManager.on('getCardDestroyedHandFull', function destroyCard(data) {
    debug(data, 'debugging.raw.fullHand');
    const card = JSON.parse(data.card);
    card.desc = getDescription(card);
    debug(data.card);
    // This event gets called for *all* discards. Have to do smarter logic here (not just currentTurn!)
    log.add(make.player(players[currentTurn]), ' discarded ', make.card(card));
  });
  eventManager.on('getPlayersStats', function updatePlayer(data) { // TODO: When does this get called?
    debug(data, 'debugging.raw.stats');
    let key, temp = JSON.parse(data.handsSize);
    for (key in temp) {
      // TODO: hand size monitoring
      //players[key].hand
    }
    // TODO: deck monitoring (decksSize)
    temp = JSON.parse(data.golds);
    for (key in temp) {
      players[key].gold = temp[key];
    }
    temp = JSON.parse(data.lives);
    for (key in temp) {
      players[key].lives = temp[key];
    }
    // data.artifcats
    // data.turn
  });
  eventManager.on('getVictory getDefeat', function gameEnd(data) {
    debug(data, 'debugging.raw.end');
    finished = true;
    if (data.disconnected) {
      log.add(make.player(players[opponentId]), " left the game");
    }
    const you = make.player(players[userId]);
    const enemy = make.player(players[opponentId]);
    if (this.event === 'getDefeat') {
      log.add(enemy, ' beat ', you);
    } else {
      log.add(you, ' beat ', enemy);
    }
  });
  eventManager.on('getResult', function endSpectating(data) {
    debug(data, 'debugging.raw.end');
    finished = true;
    if (data.cause === "Surrender") {
      log.add(`${data.looser} surrendered.`);
    } else if (data.cause === "Disconnection") {
      log.add(`${data.looser} disconnected.`);
    }
    if (typeof music !== 'undefined') {
      music.addEventListener('playing', function () {
        if (localStorage.getItem('gameMusicDisabled')) {
          music.pause();
        }
      });
    }
    // TODO: colorize
    log.add(`${data.winner} beat ${data.looser}`);
    const toast = {
      title: 'Game Finished',
      text: 'Return Home',
      buttons: {
        className: 'skiptranslate',
        text: '🏠',
        onclick: () => {
          document.location.href = "/";
        },
      },
    };
    if (!localStorage.getItem('setting.disableResultToast') && fn.toast(toast)) {
      BootstrapDialog.closeAll();
    }
  });
  eventManager.on(ignoreEvents.join(' '), function ignore(data) {
    debug(data, 'debugging.raw.ignore');
    debug(data, `debugging.raw.ignore.${this.event}`);
  });
  eventManager.on('getTurnEnd', function hideSpells() {
    // Fixes a bug with "mines" and any other potential cards that don't get cleared correctly.
    $('#board .spellPlayed').remove();
  })
});
