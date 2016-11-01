// ==UserScript==
// @name         UnderCards script
// @namespace    http://tampermonkey.net/
// @downloadURL  https://raw.githubusercontent.com/feildmaster/UnderScript/master/undercards.js
// @require      https://raw.githubusercontent.com/feildmaster/UnderScript/master/utilities.js?v=2
// @version      0.5.3
// @description  Minor changes to undercards game
// @author       feildmaster
// @match        https://undercards.net:8181/*
// @grant        none
// @history    0.5.3 - Remove the chat stuff, the new chat is better.
// @history    0.5.2 - do the same for the chat window
// @history    0.5.1 - don't cover the battle screen
// @history      0.5 - remember chat messages on page-change, added a battle log, lots of code changes
// @history      0.4 - Remember "event deck" too!, also fixed bugs.
// @history      0.3 - Lowered "game found" volume
// @history      0.2 - Added EndTurn hotkey (space, middle click), focus chat (enter)
// @history      0.1 - Made deck selection smart
// @website      https://github.com/feildmaster/UnderScript
// @supportURL   https://github.com/feildmaster/UnderScript/issues
// ==/UserScript==
// TODO: more Hotkeys
// TODO: Better battle log display (and make it movable/resizable?)
// TODO: Visual attack targets
// TODO: Random deck option
// TODO: Detailed history log
if (typeof jQuery === "undefined") return; // Might as well check if jQuery is loaded, to remove an error

var log = {
    init: function () {
        var hi = $("<div id='history'></div>"),
            ha = $("<div class='handle'>History</div>"),
            lo = $("<div id='log'></div>");
        // Positional math
        var pos = parseInt($("div.mainContent").css("width")) + parseInt($("div.mainContent").css("margin-left"));
        hi.css({
            width: `${window.innerWidth - pos - 20}px`,
            border: "2px solid white",
            "background-color": "black",
            "position": "fixed",
            right: 10,
            top: 10,
            //"max-height": `${window.innerHeight - 20}px`,
        });
        ha.css({
            "border-bottom": "1px solid white",
            "text-align": "center",
        });
        lo.css({
            "overflow-y": "auto",
            //height: "200px",
            "max-height": "600px",
        });
        hi.append(ha);
        hi.append(lo);
        // hi.draggable({handle: "div.handle",}); This breaks it :(
        $("body").append(hi);
    },
    add: function(text) {
        var add = text instanceof jQuery ? text : `<div>${text}</div>`;
        $("div#history div#log").prepend(add); // Be lazy and prepend, or append and scroll down?
    },
};

// === Variables start
var hotkeys = [
    new Hotkey("Focus Chat").bindKey(13).run(function(e) { // Join/Show chat and position cursor to input box
        if (hide) {
            // This currently already works
        }
        $('#message').focus(); // Always do this
    }),
];
// === Variables end

eventManager.on("getWaitingQueue", function lowerVolume() {
    // Lower the volume, the music changing is enough as is
    audioQueue.volume = 0.3;
});

eventManager.on("PlayingGame", function bindHotkeys() {
    // Binds to Space, Middle Click
    hotkeys.push(new Hotkey("End turn").bindKey(32).bindClick(2).run((e) => {if (!$(e.target).is("#endTurnBtn") && userTurn && userTurn === userId) endTurn();}));
});

(function battleLogger() {
    var turn = 0, currentTurn = 0, players = {}, monsters = {}, lastEffect, other = {}, finished = false;
    eventManager.on("GameStart", function() {
        log.init(); // Init the battle log... or we could wait until adding the first event?
    });

    // TODO: Clean this up
    // This is an ugly thing!
    eventManager.on("GameEvent", function(data) {
        if (finished) return; // Sometimes we get events after the battle is over
        // TODO: Delayed events... (green soul, discard (for example, sans)) 
        var card, you, enemy;
        // Battle logging happens after the game runs
        switch(data.action) {
            case "getGameStarted": // Initialize "game" history here
                you = {id: data.yourId, username: data.yourUsername, hp: 30, class: data.yourClass, level: data.yourLevel, rank: data.yourRank};
                enemy = {id: data.ennemyId, username: data.ennemyUsername, hp: 30, class: data.enemyClass, level: data.enemyLevel, rank: data.enemyRank};
            case "getAllGameInfos": // Initialize "spectate" history here
                // board = [0, 1, 2, 3, 4, 5, 6, 7, 8]
                // ---- typeCard: 0 = enemy; 1: spell
                // -- card: {attack, hp, maxHp, originalAttack, originalHp, paralyzed, silence, poisoned, taunt, id, typeCard, name, image, cost, description, rarity, shiny, quantity}
                // TODO: turnTime monitoring
                turn = data.turn || 0;
                if (!you) {
                    you = JSON.parse(data.you);
                    enemy = JSON.parse(data.ennemy);
                    you.class = data.yourClass;
                    enemy.class = data.enemyClass;
                }
                if (data.lives) {
                    var lives = JSON.parse(data.lives);
                    you.lives = lives[you.id];
                    enemy.lives = lives[enemy.id];
                }
                players[you.id] = you;
                players[enemy.id] = enemy;
                // Test changing ID's at endTurn instead of startTurn
                other[you.id] = enemy.id;
                other[enemy.id] = you.id;
                $("div#history div.handle").html(`[${data.gameType}] ${you.username} vs ${enemy.username}`);
                log.add(`Turn ${turn}`);
                if (data.userTurn) {
                    currentTurn = data.userTurn;
                    log.add(`${players[data.userTurn].username}'s turn`);
                }
                // populate monsters
                JSON.parse(data.board).forEach(function (card) {
                    if (card === null) return;
                    monsters[card.id] = card;
                });
                return;
            case "getFight": // monster attack monster
                log.add(`${monsters[data.attackMonster].name} attacked ${monsters[data.defendMonster].name}`);
                return;
            case "getFightPlayer": // monster attacking player
                log.add(`${monsters[data.attackMonster].name} attacked ${players[data.defendPlayer].username}`);
                return;
            case "getUpdatePlayerHp":
                var oHp = players[data.playerId].hp;
                var hp = data.isDamage ? oHp - data.hp : data.hp - oHp;
                players[data.playerId].hp = data.hp;
                if (oHp !== data.hp) { // If the player isn't at 0 hp already
                    log.add(`${players[data.playerId].username} ${data.isDamage ? "lost" : "gained"} ${hp} hp`);
                }
                if (data.hp === 0 && players[data.playerId].lives > 0 && !players[data.playerId].hasOwnProperty("lostLife")) { // If they have extra lives, and they didn't lose a life already
                    log.add(`${players[data.playerId].username} lost a life`);
                    players[data.playerId].lostLife = true;
                }
                return;
            case "getDoingEffect": // Card doing effect
                // affecteds: [ids]; monsters affected
                // playerAffected1: id; player affected
                // playerAffected2: id; player affected
                // TODO: Figure out how to do this better
                if (lastEffect === data.monsterId) return;
                lastEffect = data.monsterId;
                log.add(`${monsters[data.monsterId].name}'s effect activated.`);
                return;
            case "getSoulDoingEffect": // Soul doing effect
                log.add(`${players[data.playerId].username}'s soul activated.`);
                // affecteds
                // playerAffected1
                // playerAffected2
                return;
            case "updateMonster":
                // monster {card}
                return;
            case "getTurnStart": // Turn started
                lastEffect = 0;
                if (data.numTurn !== turn) {
                    log.add(`Turn ${data.numTurn}`);
                }
                currentTurn = data.idPlayer; // It would (kindof) help to actually update who's turn it is
                turn = data.numTurn;
                log.add(`${players[currentTurn].username}'s turn`);
                return;
            case "getTurnEnd": // Turn ended
                // Lets switch the turn NOW, rather than later, the purpose of this is currently unknown... It just sounded like a good idea, also delete the "lostLife" flag...
                delete players[currentTurn].lostLife;
                currentTurn = other[data.idPlayer];
                delete players[currentTurn].lostLife;
                lastEffect = 0;
                return;
            case "getUpdateBoard":
                var oldMonsters = monsters;
                monsters = {};
                // TOOD: stuff....
                JSON.parse(data.board).forEach(function (card) {
                    if (card === null) return;
                    monsters[card.id] = card;
                });
                return;
            case "getMonsterDestroyed": // Monster killed
                // monsterId: #
                log.add(`${monsters[data.monsterId].name} was killed`);
                delete monsters[data.monsterId];
                return;
                //case "refreshTimer": // Probably don't need this
            case "getPlayableCards": // Probably don't need this
                // playableCards [#...]
                return;
            case "getCardBoard": // Adds card to X, Y (0(enemy), 1(you))
                // card
                // idPlayer
                card = JSON.parse(data.card);
                monsters[card.id] = card;
                log.add(`${players[data.idPlayer].username} played ${card.name}`);
                return;
            case "getSpellPlayed": // Spell used
                // idPlayer
                // card
                // immediately calls "getDoingEffect" and "getUpdateBoard"
                card = JSON.parse(data.card);
                monsters[card.id] = card;
                log.add(`${players[data.idPlayer].username} used ${card.name}`);
                return;
            case "updateSpell": // Use spell
                return;
            case "getFakeDeath": // Card fake exploded... will be re-added 1 second later?
                return;
            case "getCardDestroyedHandFull": // Card destroyed from full hand
                card = JSON.parse(data.card);
                // This event gets called for *all* discards. Have to do smarter logic here (not just currentTurn!)
                log.add(`${players[currentTurn].username} discarded ${card.name}`);
                return;
            case "getPlayerStats": // TODO: When does this get called?
                var key, temp = JSON.parse(data.handsSize);
                for (key in temp) {
                    // TODO: hand size monitoring
                    //players[key].hand
                }
                // TODO: deck monitoring (decksSize)
                // TODO: gold monitoring (golds)
                temp = JSON.parse(data.lives);
                for (key in temp) {
                    players[key].lives = temp[key];
                }
                return;
            case "getResult": // Fight Finish
                finished = true;
                if (data.cause === "Surrender") {
                    log.add(`${data.looser} surrendered.`);
                }
                if (data.cause === "Chara") {
                    //log.add(`${data.winner} played Chara`);
                }
                if (data.cause === "Disconnection") {
                    log.add(`${data.looser} disconnected.`);
                }
                log.add(`${data.winner} beat ${data.looser}`);
                return;
        }
    });
})();

// === Play changes start
if (onPage("Play")) {
    var applyDeck = function(type, last) {
        var deck = $(`#${type}`);
        if (!deck.length) return;
        if (localStorage[last] && $(`#${type} option`).filter((i,o) => o.value === localStorage[last]).length !== 0) {
            deck.val(localStorage[last]).change();
        }
        deck.change(function update() {
            localStorage[last] = $(`#${type} option:selected`).val();
        });
    };

    applyDeck("classicDecks", "lastClassic"); // Classic class storage
    applyDeck("rankedDecks", "lastRanked"); // Ranked class storage
    applyDeck("eventDecks", "lastEvent"); // Event class storage

    // TODO: Better "game found" support
    var oHandler = socketQueue.onmessage;
    socketQueue.onmessage = function onMessageScript(event) {
        var data = JSON.parse(bin2str(event.data));
        oHandler(event);
        eventManager.emit(data.action, data);
    };
}
// === Play changes end

// === Game changes start
if (onPage("Game")) {
    var oHandler = socket.onmessage;
    socket.onmessage = function onMessageScript(event) {
        var data = JSON.parse(bin2str(event.data));
        //console.log(bin2str(event.data));
        oHandler(event);
        if (data.action === "getGameStarted") {
            // We're running our game.
            eventManager.emit("GameStart");
            eventManager.emit("PlayingGame");
        }
        eventManager.emit("GameEvent", data);
    };
}
// === Game changes end

// Spectate mode
if (onPage("gameSpectate")) {
    eventManager.emit("GameStart");

    var oHandler = socket.onmessage;
    socket.onmessage = function onMessageScript(event) {
        //console.log(bin2str(event.data));
        oHandler(event);
        eventManager._emitRaw("GameEvent", event.data);
    };
}
// Spectate mode

// === Always do the following
// Bind hotkey listeners
$(document).on("click.script", function (event) {
    if (false) return; // TODO: Check for clicking in chat
    hotkeys.forEach(function(v) {
        if (v.clickbound(event.which)) {
            v.run(event);
        }
    });
});
$(document).on("keyup.script", function (event) {
    if ($(event.target).is("input")) return; // We don't want to listen while typing in chat (maybe listen for F-keys?)
    hotkeys.forEach(function(v) {
        if (v.keybound(event.which)) {
            v.run(event);
        }
    });
});
$(window).unload(function() {
    // Store chat text (if any)
    var val = $("#message").val();
    if (!val) return;
    localStorage.oldChat = val;
});
if (localStorage.oldChat) {
    $("#message").val(localStorage.oldChat);
    delete localStorage.oldChat;
}
