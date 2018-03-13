// ==UserScript==
// @name         UnderCards script
// @description  Minor changes to undercards game
// @require      https://raw.githubusercontent.com/feildmaster/SimpleToast/1.4.1/simpletoast.js
// @require      https://raw.githubusercontent.com/feildmaster/UnderScript/master/utilities.js?v=7
// @version      0.10.1
// @author       feildmaster
// @history   0.10.1 - Renamed
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
// @match        https://undercards.net/*
// @website      https://github.com/feildmaster/UnderScript
// @supportURL   https://github.com/feildmaster/UnderScript/issues
// @downloadURL  https://raw.githubusercontent.com/feildmaster/UnderScript/master/undercards.user.js
// @namespace    https://feildmaster.com/
// @grant        none
// ==/UserScript==

// Use the user.js file
