// ==UserScript==
// @name         UnderCards script
// @namespace    http://tampermonkey.net/
// @updateURL    https://gist.githubusercontent.com/feildmaster//raw/undercards.meta.js
// @downloadURL  https://gist.githubusercontent.com/feildmaster//raw/undercards.js
// @version      0.1
// @description  Minor changes to undercards game
// @author       feildmaster
// @match        https://undercards.net:8181/Play
// @match        https://undercards.net:8181/Game
// @grant        none
// @history      0.1 - Made deck selection smart
// ==/UserScript==

// Play changes
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

// Game changes
if (location.pathname === "/Game") {
    // TODO: Event log
    // TODO: Visual taunt
}
