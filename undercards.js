// ==UserScript==
// @name         UnderCards script
// @namespace    http://tampermonkey.net/
// @updateURL    https://gist.githubusercontent.com/feildmaster/d151a1cc3c7055bfd8b3323ae1529046/raw/undercards.meta.js
// @downloadURL  https://gist.githubusercontent.com/feildmaster/d151a1cc3c7055bfd8b3323ae1529046/raw/undercards.js
// @require      https://gist.githubusercontent.com/feildmaster/d151a1cc3c7055bfd8b3323ae1529046/raw/utilities.js?v=1
// @version      0.2
// @description  try to take over the world!
// @author       feildmaster
// @match        https://undercards.net:8181/*
// @grant        none
// @history      0.2 - Added EndTurn hotkey (space, middle click), focus chat (enter)
// @history      0.1 - Made deck selection smart
// ==/UserScript==

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

// === Play changes start
if (location.pathname === "/Play") {
    // Classic class storage
    if (localStorage.lastClassic && $('#rankedDecks option').filter((i,o) => o.value === localStorage.lastRanked).length !== 0) {
        $('#classicDecks').val(localStorage.lastClassic).change();
    }
    $('#classicDecks').change(function updateClassic() {
        localStorage.lastClassic = $('#classicDecks option:selected').val();
    });

    // Ranked class storage
    if (localStorage.lastRanked && $('#rankedDecks option').filter((i,o) => o.value === localStorage.lastRanked).length !== 0) {
        $('#rankedDecks').val(localStorage.lastRanked).change();
    }
    $('#rankedDecks').change(function updateRank() {
        localStorage.lastRanked = $('#rankedDecks option:selected').val();
    });

    // TODO: Better "game found" support
}
// === Play changes end

// === Game changes start
if (location.pathname === "/Game") {
    var started = false;
    // TODO: more Hotkeys
    hotkeys.push(new Hotkey("End turn").bindKey(32).bindClick(2).run((e) => {if (started && !$(e.target).is("#endTurnBtn") && userTurn && userTurn === userId) endTurn();})); // Binds to Space, Middle Click

    // TODO: Event log
    // TODO: Visual attack targets
    var oHandler = socket.onmessage;
    socket.onmessage = function onMessageScript(event) {
        var data = JSON.parse(bin2str(event.data));
        if (data.action === "getGameStarted") {
            // We're running our game.
            started = true;
        }
        oHandler(event);
    };
}
// === Game changes end

// === Always do the following
// Bind hotkey listeners
$(".mainContent").on("click.script", function (event) {
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