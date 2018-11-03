// ==UserScript==
// @name         UnderCards script
// @description  Various changes to undercards game
// @require      https://raw.githubusercontent.com/feildmaster/SimpleToast/1.10.1/simpletoast.js
// @version      0.18.2
// @author       feildmaster
// @history   0.18.2 - New release process
// @history   0.18.1 - Fix smooth scrolling, don't rush updates!
// @history     0.18 - Added the long awaited Deck Storage
// @history   0.17.3 - Fixed smooth scrolling for small resolutions, when your deck isn't full (Thanks Liryax)
// @history   0.17.2 - Fixed a display issue when opening packs
// @history   0.17.1 - Fixed smooth scrolling for small resolutions
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
// @updateURL    https://unpkg.com/underscript/dist/undercards.meta.js
// @downloadURL  https://unpkg.com/underscript
// @namespace    https://feildmaster.com/
// @grant        none
// ==/UserScript==
