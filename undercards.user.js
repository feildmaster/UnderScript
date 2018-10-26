// ==UserScript==
// @name         UnderCards script
// @description  Various changes to undercards game
// @require      https://raw.githubusercontent.com/feildmaster/SimpleToast/1.10.1/simpletoast.js
// @require      https://raw.githubusercontent.com/feildmaster/UnderScript/0.17/utilities.js
// @version      0.17
// @author       feildmaster
// @history     0.17 - Added "quick open" for packs (ctrl+click), smooth scrolling deck list, fixed hover boxes being odd with scrolling,
//                      "Open all" packs (shift+click), displays a toast with compressed results
// @history     0.16 - Prevent custom game screen from timing out (as often), fixed 'endTurn' hotkeys
// @history   0.15.1 - Fixed small game lists taking up so much space
// @history     0.15 - Added a "mention" button (Thanks LampLighter), fix display of chat window, some settings I made with Ceveno in mind
// @history     0.14 - Utilize the full home page space (for viewing spectator games)
// @history   0.13.1 - Fixed chat bugs caused by this script, fixed end turn button moving
// @history     0.13 - Ignore chat messags? Yes please. (Thanks CoolEdge)
// @history     0.12 - New look for "Skin Shop" & Added "Dust Counter" (Thanks Jake Horror)
// @history   0.11.5 - The following now work again: end turn "fixes", deck auto-sort, deck preview.
// @history   0.11.4 - Fix issue where script was not loading
// @history   0.11.3 - Fix mines (and other potential cards) staying around on the baord for too long
// @history   0.11.2 - End turn once per turn, and add a 3 second delay. Fix middle click
// @history   0.11.1 - Peaking at cards now adds them to the battle log, join queue button stays disabled when the server is restarting
// @history     0.11 - Fix transparent deck preview, automatically sort deck
// @history   0.10.3 - Fix refreshing page, Log artifact activations
// @history   0.10.2 - Bump version so broken updates work (hopefully)
// @history   0.10.1 - Moved file to proper extension (makes fresh installs easier)
// @history     0.10 - Added deck card preview
// @history    0.9.2 - Fixed enemy names *again* (copy/pasting is bad)
// @history    0.9.1 - Spectate result music is now disabled if you disable music playing.
// @history    0.9.0 - Added detailed history log, log is top-bottom now, battle end is now a toast
// @history    0.8.5 - Added some game debug
// @history    0.8.4 - Removed "remember deck" feature (upstream), fixed event log
// @history    0.8.3 - Script works now
// @history    0.8.2 - Fix the queue disconnecting.
// @history    0.8.1 - Rework loading jQuery performance
// @history      0.8 - Better performance and reliability. Disable the join queue buttons until they are ready
// @history      0.7 - updated to new restrictions, thanks cloudflare -_-
// @history      0.6 - some upgrades to the battle log, fixed url
// @history    0.5.4 - Don't scroll the battle log with the page (possibly make this configurable later)
// @history    0.5.3 - Remove the chat stuff, the new chat is better.
// @history    0.5.2 - do the same for the chat window
// @history    0.5.1 - don't cover the battle screen
// @history      0.5 - remember chat messages on page-change, added a battle log, lots of code changes
// @history      0.4 - Remember "event deck" too!, also fixed bugs.
// @history      0.3 - Lowered "game found" volume
// @history      0.2 - Added EndTurn hotkey (space, middle click), focus chat (enter)
// @history      0.1 - Made deck selection smart
// @match        https://*.undercards.net/*
// @homepage     https://feildmaster.github.io/UnderScript/
// @source       https://github.com/feildmaster/UnderScript
// @supportURL   https://github.com/feildmaster/UnderScript/issues
// @downloadURL  https://feildmaster.github.io/UnderScript/undercards.user.js
// @namespace    https://feildmaster.com/
// @grant        none
// ==/UserScript==

// === Variables start
const hotkeys = [];
// === Variables end

eventManager.on("getWaitingQueue", function lowerVolume() {
  // Lower the volume, the music changing is enough as is
  audioQueue.volume = 0.3;
});

eventManager.on("PlayingGame", function bindHotkeys() {
  // Binds to Space, Middle Click
  const hotkey = new Hotkey("End turn").run((e) => {
      if (!$(e.target).is("#endTurnBtn") && userTurn === userId) endTurn();
    });
  if (!localStorage.getItem('setting.disable.endTurn.space')) {
    hotkey.bindKey(32);
  }
  if (!localStorage.getItem('setting.disable.endTurn.middleClick')) {
    hotkey.bindClick(2);
  }
  hotkeys.push(hotkey);
});

eventManager.on('PlayingGame', function fixEndTurn() {
  const oEndTurn = endTurn;
  let endedTurn = false;
  endTurn = function restrictedEndTurn() {
    if (endedTurn || $('#endTurnBtn').prop('disabled')) return;
    endedTurn = true;
    oEndTurn();
  };

  eventManager.on('getTurnStart', function turnStarted() {
    if (userTurn !== userId) return;
    endedTurn = false;
    if (turn > 3 && !localStorage.getItem('setting.disable.endTurnDelay')) {
      $('#endTurnBtn').prop('disabled', true);
      setTimeout(() => {
        $('#endTurnBtn').prop('disabled', false);
      }, 3000);
    }
  });
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

// === Index hook
onPage('', function adjustSpectateView() {
  const spectate = $('.spectateTable');
  const tbody = $('.spectateTable tbody');
  const footer = $('.mainContent footer');
  function doAdjustment() {
    tbody.css({height: 'auto', 'max-height': `${footer.offset().top - spectate.offset().top}px`});
  }
  $('.mainContent > br').remove();
  doAdjustment();
  $(window).on('resize.script', doAdjustment);
});

// === Chat hooks
if (typeof onMessage === 'function') {
  debug('Chat detected');
  let toast;

  const ignorePrefix = 'underscript.ignore.';
  const ignoreList = {};
  const context = (() => {
    function decode(string) {
      return $('<textarea>').html(string).val();
    }
    $('head').append($(`<style type="text/css">
        .chatContext { background: #F4F4F4; margin: 10px; color: #333; border: 1px dashed #000; position: absolute; z-index: 20; text-align: center; border-radius: 10px; }
        .chatContext header { padding: 0px 5px; height: auto; }
        .chatContext li {  list-style: none; margin: 0; padding: 3px; border-top: 1px solid #CCC; cursor: pointer; }
        .chatContext .disabled { background-color: #ccc; cursor: not-allowed; }
        .chatContext li:not(.disabled):hover { background-color: #003366; color: #F2F2F2; }
        .chatContext :last-child { border-radius: 0 0 10px 10px; }
      </style>`));
    const container = $('<div class="chatContext">');
    const profile = $('<li>Profile</li>');
    const ignore = $('<li>Ignore</li>');
    const mention = $('<li>Mention</li>');
    const header = $('<header>');
    container.append(header, profile, mention, ignore).hide();
    $('body').append(container);

    function open(event) {
      if (event.ctrlKey) return;
      if (toast) {
        toast.close();
      }
      close();
      const { id, name, staff } = event.data;
      event.preventDefault();
      // get top/left coordinates
      header.html(name);
      let left = event.pageX;
      const containerWidth = container.outerWidth(true);
      if (left + containerWidth > window.innerWidth) {
        left = left - containerWidth;
      }
      container.css({
        top: `${event.pageY}px`,
        left: `${left}px`,
      });
      container.show();
      const disabled = staff || id === selfId;
      container.on('click.script.chatContext', 'li', (e) => {
        if (e.target === profile[0]) {
          getInfo(event.target);
        } else if (e.target === mention[0]) {
          const input = $(event.target).closest('.chat-box').find('.chat-text');
          let text = input.val();
          if (text.length !== 0 && text[text.length - 1] !== ' ') {
            text += ' ';
          }
          text += decode(name) + ' ';
          input.val(text).focus();
        } else if (e.target === ignore[0]) {
          if (disabled) return; // If it's disabled it's disabled...
          if (!ignoreList.hasOwnProperty(id)) {
            ignoreList[id] = name;
            localStorage.setItem(`${ignorePrefix}${id}`, name);
          } else {
            localStorage.removeItem(`${ignorePrefix}${id}`);
          }
          updateIgnoreText(id);
        }
        close();
      });
      if (disabled) {
        ignore.addClass('disabled');
      } else {
        ignore.removeClass('disabled');
      }
      updateIgnoreText(id);
      $('html').on('mousedown.chatContext', (event) => {
        if ($(event.target).closest('.chatContext').length === 0) {
          close();
        }
      });
    }
    function updateIgnoreText(id) {
      if (ignoreList.hasOwnProperty(id)) {
        ignore.html('Unignore');
      } else {
        ignore.html('Ignore');
      }
    }
    function close() {
      container.hide();
      container.off('.chatContext');
      $('html').off('chatContext');
    }
    return {
      open,
      close,
    };
  })();

  // Load Ingore List
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(ignorePrefix)) {
      ignoreList[key.substr(ignorePrefix.length)] = localStorage.getItem(key);
    }
  }

  function processMessage(message, room) {
    const id = message.id;
    const user = message.user;
    const name = user.username;

    let staff = false;
    user.groups.some((group) => {
      return staff = group.priority <= 6; // This is so hacky...
    });

    let info = $(`#${room} #message-${id} #info-${user.id}`);
    if (!info.length) {
      info = $(`#${room} #message-${id} #info-${id}`);
    }
    info.on('contextmenu.script.chatContext', {
        staff,
        name,
        id: user.id,
      }, context.open);
    
    if (!staff && user.id !== selfId && ignoreList.hasOwnProperty(user.id)) {
      $(`#${room} #message-${id} .chat-message`).html('<span class="gray">Message Ignored</span>').removeClass().addClass('chat-message');
    }
  }

  eventManager.on('Chat:getHistory', (data) => {
    JSON.parse(data.history).forEach((message) => {
      processMessage(message, data.room);
    });
  });

  eventManager.on('Chat:getMessage', (data) => {
    processMessage(JSON.parse(data.chatMessage), data.room);
  });

  const oHandler = socketChat.onmessage;
  socketChat.onmessage = (event) => {
    oHandler(event);
    const data = JSON.parse(event.data);
    eventManager.emit('ChatMessage', data);
    eventManager.emit(`Chat:${data.action}`, data);
  }

  toast = fn.infoToast({
    text: 'You can right click users in chat to ignore them!',
    onClose: () => {
      toast = null; // Remove from memory
    }
  }, 'underscript.ignoreNotice', '1');

  // Fix chat window being all funky with sizes
  $('<style>').html('.chat-messages { height: calc(100% - 30px); }').appendTo('head');
}

// === Play hooks
onPage("Play", function () {
  // TODO: Better "game found" support
  debug("On play page");
  let queues, disable = true;
  let restarting = false;

  eventManager.on("jQuery", function onPlay() {
    if (disable) {
      queues = $("button.btn.btn-primary");
      queues.prop("disabled", true);
      restarting = $('p.infoMessage:contains("The server will restart in")').length === 1;
      if (restarting) {
        queues.hover(hover.show('Joining is disabled due to server restart.'));
      }
    }
  });

  (function hook() {
    if (typeof socketQueue === "undefined") {
      debug("Timeout hook");
      return setTimeout(hook);
    }
    socket = socketQueue;
    const oOpen = socketQueue.onopen;
    socketQueue.onopen = function onOpenScript(event) {
      disable = false;
      oOpen(event);
      if (queues && !restarting) queues.prop("disabled", false);
    };
    const oHandler = socketQueue.onmessage;
    socketQueue.onmessage = function onMessageScript(event) {
      const data = JSON.parse(event.data);
      oHandler(event);
      eventManager.emit(data.action, data);
    };
  })();
});

// === Game hooks
onPage("Game", function () {
  debug("Playing Game");
  eventManager.emit("GameStart");
  eventManager.emit("PlayingGame");
  (function hook() {
    if (typeof socket === 'undefined') {
      debug("Timeout hook");
      return setTimeout(hook);
    }
    const oHandler = socket.onmessage;
    socket.onmessage = function onMessageScript(event) {
      const data = JSON.parse(event.data);
      //eventManager.emit('PreGameEvent', data, true);
      oHandler(event);
      eventManager.emit('GameEvent', data);
    };
  })();
});

onPage('GamesList', function keepAlive() {
  setInterval(() => {
    socket.send(JSON.stringify({ping: "pong"}));
  }, 10000);
});

onPage('GamesList', function fixEnter() {
  let toast = fn.infoToast({
      text: 'You can now press enter on the Create Game window.',
      onClose: () => {
        toast = null;
      }
    }, 'underscript.notice.customGame', '1');

  $('#state1 button:contains(Create)').on('mouseup.script', () => {
    // Wait for the dialog to show up...
    $(window).one('shown.bs.modal', (e) => {
      const input = $('.bootstrap-dialog-message input');
      if (!input.length) return; // This is just to prevent errors... though this is an error in itself
      $(input[0]).focus();
      input.on('keydown.script', (e) => {
        if (e.which === 13) {
          if (toast) {
            toast.close();
          }
          e.preventDefault();
          $('.bootstrap-dialog-footer-buttons button:first').trigger('click');
        }
      });
    });
  });

});

// Deck hook
onPage('Decks', function () {
  debug('Deck editor');
  function hoverCard(element) {
    const id = element.attr('id');
    const shiny = element.hasClass('shiny') ? '.shiny' : '';
    const card = $(`table#${id}${shiny}:lt(1)`).clone();
    if (card.length !== 1) return;
    card.find('#quantity').remove();
    if (card.css('opacity') !== '1') card.css('opacity', 1);
    loadCard(card);
    return hover.show(card);
  }
  // Initial load
  eventManager.on('jQuery', () => {
    $('li.list-group-item').each(function (index) {
      const element = $(this);
      element.hover(hoverCard(element));
    });
    $(document).ajaxSuccess((event, xhr, settings) => {
      const data = JSON.parse(settings.data);
      if (data.action === 'removeCard') { // Card was removed, hide element
        hover.hide();
      } else if (data.action === 'addCard') { // Card was added
        const element = $(`#deckCards${data.classe} li:last`);
        element.hover(hoverCard(element, true));

        const list = $(`#deckCards${data.classe}`);
        list.append(list.children('li').detach().sort(function (a, b) {
          const card1 = $(`table#${$(a).attr('id')}`);
          const card2 = $(`table#${$(b).attr('id')}`);
          const card1cost = parseInt(card1.find('.cardCost').html(), 10);
          const card2cost = parseInt(card2.find('.cardCost').html(), 10);
          if (card1cost === card2cost) {
            const card1name = card1.find('.cardName').html();
            const card2name = card2.find('.cardName').html();
            if (card1name == card2name) return 0;
            return card1name > card2name ? 1 : -1;
          }
          return card1cost > card2cost ? 1 : -1;
        }));
      }
    });
  });

  const oLoad = window.onload;
  window.onload = () => {
    oLoad();
    const cardList = $('#yourCardList');
    cardList.css({ 
      'position': '',
      'max-width': '180px',
    });
    const oOffset = cardList.offset().top - 5;
    $(window).on('scroll.script', () => {
      if (window.pageYOffset > oOffset) {
        cardList.css({
          position: 'fixed',
          top: 5,
        });
      } else {
        cardList.css({
          position: '',
          top: '',
        });
      }
    });
  };
});

// Spectate hooks
onPage("gameSpectate", function () {
  debug("Spectating Game");
  eventManager.emit("GameStart");
  (function hook() {
    if (typeof socket === "undefined") {
      debug("Timeout hook");
      return setTimeout(hook);
    }
    const oHandler = socket.onmessage;
    socket.onmessage = function onMessageScript(event) {
      const data = JSON.parse(event.data);
      //eventManager.emit('PreGameEvent', data, true);
      oHandler(event);
      eventManager.emit('GameEvent', data);
    };
  })();
});

onPage('Packs', function quickOpenPack() {
  const rarity = [ 'DETERMINATION', 'LEGENDARY', 'EPIC', 'RARE', 'COMMON' ];
  const results = {};
  function clearResults() {
    results.shiny = 0;
    rarity.forEach((key) => results[key] = {});
  }
  function showCards() {
    $('.slot .cardBack').each((i, e) => { show(e, i); });
  }
  clearResults(); // Build once
  let autoOpen = false, openAll = false;
  $(document).ajaxComplete((event, xhr, settings) => {
    const data = JSON.parse(settings.data);
    if (settings.url !== 'PacksConfig' || !['openPack', 'openShinyPack'].includes(data.action) || data.status) return;
    if (openAll !== false) {
      JSON.parse(xhr.responseJSON.cards).forEach((card) => {
        if (!results.hasOwnProperty(card.rarity)) {
          console.error(`You're a dumbass feildmaster`);
          results[card.rarity] = {};
        }
        const rarity = results[card.rarity];
        rarity[card.name] = (rarity[card.name] || 0) + 1;
        if (card.shiny && data.action === 'openPack') {
          results.shiny += 1;
        }
      });
      openAll -= 1;
      if (openAll === 0) {
        openAll = false;
        let text = '';
        let total = 0;
        // Magic numbers, yep. Have between 6...26 cards showing
        let limit = Math.min(Math.max(Math.floor(window.innerHeight / 38), 6), 26);
        // Increase the limit if we don't have a specific rarity
        rarity.forEach((key) => {
          if (!Object.keys(results[key]).length) {
            limit += 1;
          }
        });

        // Display results
        rarity.forEach((key) => {
          const keys = Object.keys(results[key]);
          if (!keys.length) return;
          const buffer = [];
          let count = 0;
          keys.forEach((name) => {
            const cardCount = results[key][name];
            count += cardCount;
            if (limit) {
              limit -= 1;
              buffer.push(`${name}${cardCount > 1 ? ` (${cardCount})` : ''}${limit ? '' : '...'}`);
            }
          });
          total += count;
          text += `${key} (${count}):${buffer.length ? `\n- ${buffer.join('\n- ')}` : ' ...'}\n`;
        });
        fn.toast({
          text,
          title: `Pack Results (${total}${results.shiny ? `, ${results.shiny} shiny` : ''}):`,
        });
        showCards();
      }
    } else if (autoOpen) {
      showCards();
    }
  });
  $('#btnOpen, #btnOpenShiny').on('click.script', (event) => {
    autoOpen = event.ctrlKey;
    openAll = false;
    if (event.shiftKey) {
      clearResults();
      const shiny = $(event.target).prop('id') === 'btnOpenShiny' ? 'Shiny' : '';
      const count = parseInt($(`#nb${shiny}Packs`).text());
      openAll = count;
      for (let i = 1; i < count; i++) { // Start at 1, we've "opened" a pack already
        canOpen = true;
        openPack(`open${shiny}Pack`);
      }
    }
  }).on('mouseenter.script', hover.show(`<span style="font-style: italic;">
      * CTRL Click to auto reveal one pack<br />
      * Shift Click to auto open ALL packs
    </span>`)).on('mouseleave.script', hover.hide);
});

onPage('CardSkinsShop', function () {
  debug('Skin shop');
  const cards = [];
  $('table#cardSkinsList > tbody > tr').each(function(row) {
    // Is this still supported?
    if (row === 0) {
      if($(this).children('td').length !== 6) return false;
      return;
    }
    const skin = {};
    $(this).children('td').each(function(column) {
      let target;
      if (column === 0) {
        target = 'card';
      } else if (column === 1) {
        target = 'name';
      } else if (column === 2) {
        target = 'author';
      } else if (column === 3) {
        skin['img'] = $(this).children('img')[0].src;
        return;
      } else if (column === 4) {
        skin['cost'] = $($(this).children('span')[0]).html();
        return;
      } else {
        target = 'action';
        if ($(this).children('p').length) {
          skin[target] = '<a href="Shop" class="btn btn-sm btn-danger">Unlock</a>';
          return;
        }
      }
      skin[target] = $(this).html();
    });
    cards.push(skin);
  });
  if (cards.length) {
    function cardMySkin(skin) {
      return `<table class="cardBoard monster col-sm-4" style="height: 220px !important; opacity: 1; cursor: default;">
        <tbody>
          <tr>
            <td class="cardName" colspan="3">${skin.card}</td>
            <td class="ucp" style="text-align: center; font-size: 15px;">${skin.cost}</td>
          </tr>
          <tr>
            <td id="cardImage" colspan="4"><img src="${skin.img}"></td>
          </tr>
          <tr>
            <td class="cardDesc" colspan="4">${skin.name}<br />by <span class="Artist">${skin.author}</span></td>
          </tr>
          <tr>
            <td style="background-color: #000; text-align: center; margin: 0; ${skin.action.includes('<p>') ? 'color: red;' : ''}" colspan="4">${skin.action}</td>
          </tr>
        </tbody>
      </table>`;
    }
    // Load css/cards.min.css
    $.get('css/decks.min.css', (css) => $('<style type="text/css"></style>').html(css).appendTo("head"));
    $.get('css/cards.min.css', (css) => $('<style type="text/css"></style>').html(css).appendTo("head"));
    // hide #cardSkinsList
    $('table#cardSkinsList').hide();
    // add cardSkinDiv
    const div = $('<div id="cardedSkins" class="container cardsList" style="width:720px; display: block;">');
    // build skinned cards
    cards.forEach((card) => {
      div.append(cardMySkin(card));
    });
    $('div.mainContent p:first').after(div);
  }
});

// === Always do the following - if jquery is loaded
eventManager.on("jQuery", function always() {
  // Bind hotkey listeners
  $(document).on("mouseup.script", function (event) {
    if (false) return; // TODO: Check for clicking in chat
    hotkeys.forEach(function (v) {
      if (v.clickbound(event.which)) {
        v.run(event);
      }
    });
  });
  $(document).on("keyup.script", function (event) {
    if ($(event.target).is("input")) return; // We don't want to listen while typing in chat (maybe listen for F-keys?)
    hotkeys.forEach(function (v) {
      if (v.keybound(event.which)) {
        v.run(event);
      }
    });
  });
  /* This legacy code doesn't work
  $(window).unload(function() {
    // Store chat text (if any)
    var val = $("div.chat-public input.chat-text").val();
    if (!val) return;
    localStorage.oldChat = val;
  });
  if (localStorage.oldChat) {
    $("div.chat-public input.chat-text").val(localStorage.oldChat);
    delete localStorage.oldChat;
  }
  // */
});

// Attempt to detect jQuery
let tries = 20;
(function jSetup() {
  if (typeof jQuery === "undefined") {
    if (tries-- <= 0) { // jQuery is probably not going to load at this point...
      return;
    }
    setTimeout(jSetup, 1);
    return;
  }
  eventManager.emit("jQuery");
})();
