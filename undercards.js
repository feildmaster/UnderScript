// ==UserScript==
// @name         UnderCards script
// @description  Minor changes to undercards game
// @require      https://raw.githubusercontent.com/feildmaster/SimpleToast/1.4.1/simpletoast.js
// @require      https://raw.githubusercontent.com/feildmaster/UnderScript/master/utilities.js?v=5
// @version      0.9.0-beta
// @author       feildmaster
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
// @match        https://undercards.net/*
// @website      https://github.com/feildmaster/UnderScript
// @supportURL   https://github.com/feildmaster/UnderScript/issues
// @downloadURL  https://raw.githubusercontent.com/feildmaster/UnderScript/master/undercards.js
// @namespace    https://feildmaster.com/
// @grant        none
// ==/UserScript==
// TODO: more Hotkeys
// TODO: Visual attack targets
// TODO: Random deck option
// TODO: Delayed events... (green soul, discard (for example, sans))

// === Variables start
const hotkeys = [];
// === Variables end

eventManager.on("getWaitingQueue", function lowerVolume() {
  // Lower the volume, the music changing is enough as is
  audioQueue.volume = 0.3;
});

eventManager.on("PlayingGame", function bindHotkeys() {
  // Binds to Space, Middle Click
  hotkeys.push(new Hotkey("End turn").bindKey(32).bindClick(2).run((e) => {
    if (!$(e.target).is("#endTurnBtn") && userTurn && userTurn === userId) endTurn();
  }));
});

eventManager.on("GameStart", function battleLogger() {
  let turn = 0, currentTurn = 0, players = {}, monsters = {}, lastEffect, other = {}, finished = false;
  const hover = (function wrapper() {
    let e, x, y;

    function update() {
      if (!e) return;
      e.css({
        // move to left if at the edge of screen
        left: x + e.width() + 15 < $(window).width() ? x + 15 : x - e.width() - 10,
        // Try to lock to the bottom
        top: y + e.height() + 18 > $(window).height() ? $(window).height() - e.height() : y + 18,
      });
    }
    $(document).on("mousemove.script", function mouseMove(event) {
      x = event.pageX;
      y = event.pageY;
      update();
    });
    return function hover(data, border = null) {
      if (e) {
        // Hide element
        e.remove();
        e = null;
        return;
      }
      if (!data) return;
      // Make the element
      e = $("<div>");
      e.append(data);
      e.css({
        border,
        position: "fixed",
        "background-color": "rgba(0,0,0,0.9)",
        padding: '2px',
        'z-index': 20,
      });
      $("body").append(e);
      update();
    };
  })();
  const make = {
    player: function makePlayer(player, title = false) {
      const c = $('<span>');
      c.append(player.username);
      c.addClass(player.class);
      if (!title) {
        c.css('text-decoration', 'underline');
        // show lives, show health, show gold, show hand, possibly deck size as well
        const data = `${player.hp} hp, ${player.gold} gold`;
        c.hover(() => hover(data, '2px solid white'));
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
      data += `<tr><td class="cardDesc" colspan="4">${card.desc || ''}</td></tr>`;
      if (!card.typeCard) {
        data += `<tr><td id="cardATQ">${card.attack}</td><td id="cardRarity" colspan="2"><img src="images/rarity/${card.rarity}.png" /></td><td id="cardHP" class="${card.hp!==card.maxHp ? "damaged" : ""}">${card.hp}</td></tr>`;
      } else {
        data += `<tr><td id="cardRarity" colspan="4"><img src="images/rarity/${card.rarity}.png" /></td></tr>`;
      }
      data += `</table>`;
      c.hover(() => hover(data));
      return c;
    },
  };

  eventManager.on('GameEvent', function logEvent(data) {
    if (finished) { // Sometimes we get events after the battle is over
      fn.debug(`Extra action: ${data.action}`, 'debugging.extra');
      return;
    }
    const emitted = eventManager.emit(data.action, data).ran;
    if (!emitted) {
      fn.debug(`Unknown action: ${data.action}`);
    }
  });

  eventManager.on('getAllGameInfos getGameStarted', function initBattle(data) {
    let you, enemy;
    // Battle logging happens after the game runs
    if (this.event === 'getAllGameInfos') {
      you = JSON.parse(data.you);
      enemy = JSON.parse(data.enemy);
      you.class = data.yourClass;
      enemy.class = data.enemyClass;
      // Set gold
      const gold = JSON.parse(data.golds);
      you.gold = gold[you.id];
      enemy.gold = gold[enemy.id];
      // Set lives
      const lives = JSON.parse(data.lives);
      you.lives = lives[you.id];
      enemy.lives = lives[enemy.id];
      // populate monsters
      JSON.parse(data.board).forEach(function (card) {
        if (card === null) return;
        card.desc = getDescription(card);
        monsters[card.id] = card;
      });
    } else {
      you = {
        id: data.yourId,
        username: data.yourUsername,
        hp: 30,
        class: data.yourClass,
        level: data.yourLevel,
        rank: data.yourRank,
        gold: 2
      };
      enemy = {
        id: data.ennemyId,
        username: data.ennemyUsername,
        hp: 30,
        class: data.enemyClass,
        level: data.enemyLevel,
        rank: data.enemyRank,
        gold: 2
      };
    }
    turn = data.turn || 0;
    players[you.id] = you;
    players[enemy.id] = enemy;
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
    // affecteds: [ids]; monsters affected
    // playerAffected1: id; player affected
    // playerAffected2: id; player affected
    // TODO: Figure out how to do this better
    if (lastEffect === data.monsterId) return;
    lastEffect = data.monsterId;
    log.add(make.card(monsters[data.monsterId]), "'s effect activated");
  });
  eventManager.on('getSoulDoingEffect', function soulEffect(data) {
    if (lastEffect === data.playerId - 2) return;
    lastEffect = data.playerId - 2;
    log.add(make.player(players[data.playerId]), "'s soul activated");
    // affecteds
    // playerAffected1
    // playerAffected2
  });
  eventManager.on('getTurnStart', function turnStart(data) {
    lastEffect = 0;
    if (data.numTurn !== turn) {
      log.add(`Turn ${data.numTurn}`);
    }
    currentTurn = data.idPlayer; // It would (kindof) help to actually update who's turn it is
    turn = data.numTurn;
    log.add(make.player(players[currentTurn]), "'s turn");
  });
  eventManager.on('getTurnEnd', function turnEnd(data) {
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
    const oldMonsters = monsters;
    monsters = {};
    // TOOD: stuff....
    JSON.parse(data.board).forEach(function (card) {
      if (card === null) return;
      card.desc = getDescription(card);
      monsters[card.id] = card;
    });
  });
  eventManager.on('getMonsterDestroyed', function monsterKilled(data) {
    // monsterId: #
    log.add(make.card(monsters[data.monsterId]), ' was killed');
    delete monsters[data.monsterId];
  });
  eventManager.on('getCardBoard', function playCard(data) { // Adds card to X, Y (0(enemy), 1(you))
    const card = JSON.parse(data.card);
    card.desc = getDescription(card);
    monsters[card.id] = card;
    log.add(make.player(players[data.idPlayer]), ' played ', make.card(card));
  });
  eventManager.on('getSpellPlayed', function useSpell(data) {
    // immediately calls "getDoingEffect" and "getUpdateBoard"
    const card = JSON.parse(data.card);
    card.desc = getDescription(card);
    monsters[card.id] = card;
    log.add(make.player(players[data.idPlayer]), ' used ', make.card(card));
  });
  eventManager.on('getCardDestroyedHandFull', function (data) {
    const card = JSON.parse(data.card);
    card.desc = getDescription(card);
    debug(data.card);
    // This event gets called for *all* discards. Have to do smarter logic here (not just currentTurn!)
    log.add(make.player(players[currentTurn]), ' discarded ', make.card(card));
  });
  eventManager.on('getPlayersStats', function updatePlayer(data) { // TODO: When does this get called?
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
  eventManager.on('getVictory getVictoryDeco getDefeat', function gameEnd(data) {
    finished = true;
    if (this.event === 'getVictoryDeco') {
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
    finished = true;
    if (data.cause === "Surrender") {
      log.add(`${data.looser} surrendered.`);
    } else if (data.cause === "Disconnection") {
      log.add(`${data.looser} disconnected.`);
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
  eventManager.on('updateMonster', function updateCard(data) {
    // monster {card}
  });
  eventManager.on('refreshTimer getPlayableCards updateSpell getFakeDeath',
    function ignore() {});
});

// === Play hooks
onPage("Play", function () {
  // TODO: Better "game found" support
  debug("On play page");
  let queues, disable = true;

  eventManager.on("jQuery", function onPlay() {
    if (disable) {
      queues = $("button.btn.btn-primary");
      queues.prop("disabled", true);
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
      if (queues) queues.prop("disabled", false);
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
      if (data.action === "getGameStarted") {
        // We're running our game.
        eventManager.emit("GameStart");
        eventManager.emit("PlayingGame");
      }
      eventManager.emit('GameEvent', data);
    };
  })();
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

// === Always do the following - if jquery is loaded
eventManager.on("jQuery", function always() {
  // Bind hotkey listeners
  $(document).on("click.script", function (event) {
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
