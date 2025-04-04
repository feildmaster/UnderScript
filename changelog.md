# UnderScript Changelog

## Version 0.62.1 (2025-04-04)
1. Fixed plugins breaking when providing custom settings

## Version 0.62.0 (2025-04-03)
### Fixes
1. April fools setting is no longer so greedy
1. April fools setting properly applies when home page refreshes
1. Minor bug fixes related to settings
### Plugins
1. Added `keybind` setting type
1. Added `advancedMap` setting type
  <extended>
  1. `type: { key?: SettingType, value?: SettingType },`
  </extended>
1. Added `underscript.utils.translateText()`<extended>
```ts
  translateText(text: string, {
    args: string[],
    fallback?: string,
    locale?: string, // translate as a specific language
  });
```
</extended>

## Version 0.61.0 (2025-04-01)
Surprise! April fools update.
### Fixes
1. Manual updates now fix broken update announcements
1. Updated April fools settings to work for this year
### Plugins
1. Added support for plugins to provide their version
1. Added `Settings:open` event
1. Added `plugin.events.compound(...events, callback)`
1. Added `plugin.version`
1. Added `disabled` to setting creation

## Version 0.60.4 (2025-03-18)
1. Fixed notification sound turning off permanently

## Version 0.60.3 (2025-03-17)
1. Due to popular demand, you are now prompted to keep `@underscript`
1. Fixes some bugs with toasts

## Version 0.60.2 (2025-03-16)
1. Fixed quest progress notification (probably)

## Version 0.60.1 (2025-03-15)
The great plugin (& bug fix) update
### Fixes
1. Deck Storage now translates card names
1. The CSS for settings no longer do silly things
1. Setting "reset" now allows a default value of 0
1. Settings now always properly encode before saving
1. Stopped an error from happening when logged out
1. Broken settings no longer completely break the setting window
### Plugins
1. You can now edit settings while the setting window is open
1. Added `map` setting type
1. Allow event listeners to be turned off
1. Renamed event `:loaded` to `:preload`
1. Added `name` to setting creation

## Version 0.60.0 (2025-03-15)
- See v0.60.1

## Version 0.59.0 (2025-01-31)
New release for a new year. Enjoy~
### Fixes
1. Find pack prices smartly
1. Fixed some debug messages
### Plugins
1. Added `Home:Refresh` event
1. Added new `Item` keywords

## Version 0.58.3 (2024-06-19)
1. Fixed friendship shiny packs

## Version 0.58.2 (2024-05-29)
1. Fixed broken pack buying API
1. Added more cases where chat will reconnect

## Version 0.58.1 (2024-05-24)
1. Re-enabled smart disenchant
  - This is still at your own risk, and you must manually enable it in settings.

## Version 0.58.0 (2024-04-27)
### New Features
1. Automatically attempt to reconnect to chat
1. Ignore self legend messages
### Plugin
1. Added [script](https://raw.githubusercontent.com/UCProjects/UnderScript/master/src/checkerV2.js) to validate underscript for plugins to utilize in their code
  - This is easier to use than the [old one](https://raw.githubusercontent.com/UCProjects/UnderScript/master/src/checker.js)

## Version 0.57.2 (2024-04-10)
1. Fixed display bug with cosmetic confirmation purchases
1. Fixed bug loading all cards
1. Fixed bug loading plugin styles

## Version 0.57.1 (2024-04-06)
1. Made filtered buttons dimmer
1. Made Shiny filtered button bigger
1. Fixed collection dropdown filter translation error

## Version 0.57.0 (2024-04-01)
### New Features
1. Added filter for tribes
1. Added filters for crafting collection
1. Cleaned the filter buttons so it looks less cluttered
### Misc.
1. Adjust music volume while in settings
### Plugin
1. Added method for plugins to add own collection filters `plugin.addFilter()`

## Version 0.56.3 (2024-03-31)
1. Removed broken googletagmanager
1. Fixed broken sound code
1. Fixed broken backgrounds

## Version 0.56.1 (2024-01-21)
1. Add support for older browsers

## Version 0.56.0 (2023-10-22)
### Plugins
1. Added a few more Constants
1. Added `plugin.settings().value(key)` lookup

## Version 0.55.6 (2023-10-19)
1. Breaking quest stuff, CMD_God will need to update :sad:

## Version 0.55.5 (2023-10-17)
1. More quest stuff (Thank CMD_God)

## Version 0.55.4 (2023-10-17)
1. Fix quest reward bug

## Version 0.55.3 (2023-10-16)
1. Fixed another quest bug

## Version 0.55.1 (2023-10-16)
1. Fixed quest detection

## Version 0.55.0 (2023-10-15)
### New Features
1. Implement Bug Tracker (Sentry.io)
1. Quest Progress Toast
### Misc.
1. Update google analytics
### Plugins
1. `player:endTurn` event (cancelable)
1. `plugin.quests.update()`: Updates quests, returns `Promise.then({ quests, previous }).catch(error)`
1. `plugin.quests.getQuests()`: Gets currently cached quests (empty if update is not called)

## Version 0.54.1 (2023-08-19)
1. (Really) Fixed `Collect All` friendship button
1. Re-enable play queue after 10 seconds

## Version 0.54.0 (2023-07-08)
### New Features
1. Import deck via URL
### Fixes
1. Fixed `Collect All` frienship button
### Misc.
1. Removed `Disable Quick Opening Packs` setting

## Version 0.53.1 (2023-07-02)
1. Fixed changelog
1. Fixed friendship ranking not loading sometimes

## Version 0.53.0 (2023-05-23)
### New Features
1. Added craft/disenchant protection to prevent double clicking
1. Added new ranks to board background priority
### Fixes
1. Fix background of `@autocomplete`

## Version 0.52.1 (2023-04-05)
1. Fixed issue breaking sound in games

## Version 0.52.0 (2023-04-03)
### New Features
1. Added setting to disable `Audio Override` (disables undercards Audio fixes)
1. Added setting to disable `April Fools Music` (if you get tired of it)
### Fixes
1. Fixed april fools music not working with underscript
1. Fixed translations thinking they weren't loaded when they were
### Misc.
1. BootstrapDialog `onhide()` return value is no longer ignored
### Plugins
1. EventEmitter is now extendable
1. Throw errors when failing to register settings
1. `appendCard()` is deprecated
1. Settings now have more dynamic values
1. Added [`checkUnderscript(pluginName)`](https://raw.githubusercontent.com/UCProjects/UnderScript/master/src/checker.js) for plugins to utilize in their code
1. `appendCard` events are now all called correctly

## Version 0.51.3 (2022-12-13)
1. Fix appendCard data

## Version 0.51.2 (2022-10-30)
1. Actually fix issue in all cases

## Version 0.51.1 (2022-10-30)
1. Fix issue where PrettyCards would break descriptions

## Version 0.51.0 (2022-10-29)
### New Features
1. Added events for ALL `appendCard` functions
1. Added `crafterror` event
1. Added user deck functions `user.getDecks`, `user.getCollection`, `user.getArtifacts`
1. Added `user.getUCP` function
1. Cards get marked as `new` if you don't currently have them in your collection
1. Translate various setting names/values
1. Added `user.getCardSkins`
### Fixes
1. Fixed plugin modules not loading properly when they depend on another module
1. Fixed `craftcard` event
1. Fixed some content toasts
1. Fixed delayed singleton data emittion
### Misc.
1. `emitter.one` alias for `emitter.once`
### Plugins
1. Added `plugin.settings.open`
1. Added plugin hotkey registration

## Version 0.50.6 (2022-06-22)
1. Fixed error with script loading
1. Fix `undefined dust`
1. Spectate*
1. Fix persist bgm breaking skin themes
1. Allow music played by underscript to be cancelable
1. Fixed minigame playing when disabled
1. Possibly fixed friends list errors
1. `:loaded` event can't be delayed
1. Fixed a few issues with settings display

## Version 0.50.4 (2022-04-06)
1. Fixed "ignore user" setting
1. Fixed "trust link" setting
1. Fixed "auto decline" setting
1. Changed icon for dragging list items
1. Added notification (with setting) when background is overridden
1. Fixed dust pile counter
1. Fixed note for buying packs

## Version 0.50.3 (2022-03-29)
1. Fixed UnderScript being too fast for its own good

## Version 0.50.2 (2022-03-29)
1. Fixed settings not showing sometimes
1. Fixed setting notes not showing
1. Added another alternate update link

## Version 0.50.1 (2022-03-28)
1. Fixed boolean setting errors
1. Fixed board background setting not applying your background
  1. NOTE: If you changed this setting, Legend is now at the bottom of your list due to a bug.

## Version 0.50.0 (2022-03-28)
### New Features
1. Colorized cards in deck storage
1. Added setting to show your preferred board background (Settings -> Game)
### Fixes
1. Fixed error toasts (red) ignoring their close events
1. Fixed storage not coloring correctly sometimes
1. Fixed player damage/healing not showing
1. Fixed a bug when hiding minigames
1. Fixed bug when chat is not loaded
### Misc
1. Pack opener tries a bit harder to open all packs
1. Check pending friend requests quicker
1. Settings code is much cleaner
### Plugins
1. Added `plugin.settings().addType(new YourSettingType())`
1. Added `underscript.utils.compoundEvent(...events, callback)`
1. Added `allCardsReady` event

## Version 0.49.4 (2022-03-07)
1. Fixed some pack opening bugs
1. Fix import showing missing cards when you have a shiny to replace it
1. Fix /scroll bug
1. Fix multiple update notifications

## Version 0.49.3 (2022-03-06)
1. Fixed craft border highlighting when not enough dust
1. Fixed max crafting without enough dust
1. Fixed CSS not loading at correct time
1. Fixed "trusted link" not opening the link
1. Fixed a small bug with chat

## Version 0.49.2 (2022-03-02)
1. Fixed hub showing missing cards when you have the full deck
1. Fixed in-game emotes not being disabled (again)
1. Fixed "gaining -HP"
1. Fixed loading deck after switching souls

## Version 0.49.1 (2022-02-26)
### New Features
1. Mark hub decks missing DT(s)
1. Mark missed quest days
1. Large Icon mode
1. Trusted domains (like in discord)
### Fixes
1. Fixed chat events not registering sometimes
1. Fixed dismissable toasts appearing when dismissed.
1. Fixed bug with spectating events
1. Fixed persistent arena background
1. Fixed in-game emotes not being disabled
1. Fixed some spectate events not working
1. Fixed a bug when spectating as a guest
1. Fixed hub display issues
### Misc
1. Battle log now shows artifact details
### Plugins
1. Added `pre:appendCard()` event

## Version 0.48.0 (2022-01-23)
### New Features
1. Added settings to disable/hide individual emotes you own
1. Added a few new events
  <extended>
  1. :loaded:PAGE
  1. :load:PAGE
  1. :unload:PAGE
  </extended>
1. Added `async` and `delayed` to event meta
1. Added `canceled` to event emitter<extended>: sets initial canceled state to true</extended>
### Fixes
1. Fixed singletons being callable twice
1. Improved pack opening algorithm
1. Fixed a few issues with event emitter

## Version 0.47.1 (2021-12-16)
### New Features
1. New display for underscript settings
1. Added audio settings
1. Game errors now show a notification instead of a window
### Plugins
1. Expose more `events` functions
1. Fix `user.ignore()`
1. Added `setting.show()` to open the settings window
1. Removed deprecated `underscript.addStyle()`

## Version 0.46.4 (2021-10-31)
1. Fixed streamer mode chat
1. Sandboxed `underscript.addStyle`
1. Fixed randomly broken setting

## Version 0.46.3 (2021-10-31)
1. Skipped on accident

## Version 0.46.2 (2021-08-16)
1. Fixed minimizing chat
1. Added "alt" update button on update toast

## Version 0.46.1 (2021-08-12)
1. Fixed script not working

## Version 0.46.0 (2021-08-12)
### New Features
1. Added modes to "Random fill deck" button
1. Added "new card" toast
### Fixes
1. Fixed deck storage loading
1. Fixed chat not showing up with certain settings
### Plugins
1. Expose `underscript.utils`
1. Expose `underscript.lib`
1. BootstrapDialog events `BootstrapDialog:create|show|shown|hide|hidden`

## Version 0.45.1 (2021-06-16)
1. Fixed import bug (what does testing mean?)\

## Version 0.45.0 (2021-06-16)
### New Features
1. Added ability to buy multiple packs
1. Added confirmation for buying packs with UCP
1. Added a setting to switch minigame controls to WASD (disabled by default)
1. Added a random avatar button
1. Added setting to prefer shiny on import (enabled by default)
1. Added "fill deck" button
1. Added confirmation for buying cosmetics
### Fixes
1. Fixed bug with base card skin setting
### Plugins
1. Added API to buy multiple packs
### Misc.
1. Added a 5th slot to the storage rows

## Version 0.44.0 (2021-05-30)
### New Features
1. Now handles Quest Pass announcements
1. Added "outline card text" setting
1. Added "outline card tribe" setting
1. Added setting to disable *all* card skins
1. Added toast when kicking non-friends out of custom games
### Fixes
1. Fixed translation preview
1. Fixed crafting more than max (with CTRL)
### Misc.
1. Removed "smart disenchant"

## Version 0.43.3 (2020-12-31)
1. Completely disabled smart disenchant, until it's remade.

## Version 0.43.3 (2020-12-30)
1. Fixed issue where background tasks didn't run correctly
  * This includes: Accepting friends, Deleting Friends, Refreshing the main page, Quest notifications...

## Version 0.43.2 (2020-12-24)
Merry Christmas!
1. Fixed friendship bug
1. Fixed not being able to copy battle log text
1. Fixed a bug I missed in the last update
1. Changed how UnderScript loads 3rd party code

## Version 0.43.1 (2020-12-24)
This update is broken!

## Version 0.43.0 (2020-12-05)
### New Features
1. Added button to show your friend rankings on the leaderboard
1. Added setting to disable friend request notifications
1. Added option to show "breaking" art as "full" art
### Fixes
1. Fix page selection on leaderboard
1. Loading user links on leaderboard now load correctly
1. Fix deleting friends without reloading page
1. Error when loading deck correctly exits
### Plugins
1. Added "eventManager.once(event, function)"<extended> - Listens to event once</extended>
1. Added "eventManager.until(event, function)"<extended> - Listens to event until returns truthy</extended>

## Version 0.42.0 (2020-11-01)
### New Features
1. Added setting to ignore pings from closed chats
1. Opponent now shows on autocomplete
1. Added external projects to Undercards Menu
1. Added option to only show online friends in autocomplete
### Fixes
1. Fixed user turn not showing in battle log
1. Fixed streamer mode chat errors
1. Fixed online friends not updating (thanks Onu)

## Version 0.41.2 (2020-10-15)
1. Fixed Token not working in Craft page (again)

## Version 0.41.1 (2020-10-15)
1. Fixed "Token" not working in Crafting page.
1. History pings no longer make sound
1. Ping toasts now use correct channel name

## Version 0.41.0 (2020-10-12)
### New Features
1. Reload Cards menu item
### Fixes
1. Load storage more reliably
1. Don't show "turn start" twice
1. Load card name from storage
### Misc.
1. Changed @everyone to @underscript
1. Updated for next patch

## Version 0.40.0 (2020-08-31)
### New Features
1. First/Last page shortcut now works on every valid webpage
1. Page selection now works on every valid webpage
1. Split Generated and Base rarities on the crafting screen.
1. Merge shiny and non-shiny in collection (default: Deck only)
  1. Settings -> Library -> Merge Shiny Cards
Note: When these filter settings are applied, the rarity icons are semi-transparent (making them look darker)


## Version 0.39.2
1. Fixed battle log being inconsistent on game finish for players/spectators
1. Fixed some internal bugs
1. Fixed queue disabled message

## Version 0.39.1
1. Fixed broken avatars

## Version 0.39.0
### New Features
1. Minigames no longer take over your arrow keys while playing them
1. Friendship now displays rankings for each of your cards
### Fixes
1. Added setting to disable "collect all friendship"
1. Autocomplete no longer selects trailing text
1. Better translation preview support
### Plugins
1. Fixed some bugs
1. Deprecated "cancelable" events

## Version 0.38.1
1. Fixed bug that made deck storage load only one card at a time
1. Fixed bug where deleted artifacts caused deck loading to repeat endlessly

## Version 0.38.0
### New Features
1. Display a toast about space/middle click turn skip hotkey
1. Added a friendship reward toast
1. Added a progress bar when opening multiple packs (and a stop button)
1. Added a button to collect all available Friendship rewards
### Fixes
1. You can now open all packs again
1. Fixed patch notes not showing on mid-season patch
1. Fixed a bug with loading new reinforcement artifact from deck storage
1. Fixed a bug with Bundle toasts not working
1. Fixed bug where it thinks you're on the play page while in a game
### Misc
1. Removed duplicate "disable skin toasts" setting

## Version 0.37.0
### New Features
1. Added setting to disable game list refresh
### Fixes
1. Fixed completed daily quests looking bad
### Stop-gap
1. Quick opening packs can now only open 10 at a time, due to Onucode.

## Version 0.36.2
1. Fixed background song playing twice
1. Fixed duplicate names in autocomplete

## Version 0.36.1
1. Fixed various bugs

## Version 0.36.0
### New Features
1. Visual Autocomplete
1. List completed quests
1. Call an event when translations get loaded
1. Disable breaking card art setting
### Fixes
1. CTRL+SHIFT when opening packs will only open one pack (with toast)
1. Fixed not having any ping phrases causing everything to ping you
1. Fixed battle log setting not applying while playing game
1. Fixed ignoring stacking messages in a single window
1. Fixed 'none' ignore type not being an option
1. Fix the header mixing with card tribes and such
1. Footer can no longer cover any part of the page
1. Vanilla settings that shouldn't show no longer show
1. Fixed bugs that cropped up when the spectate URL changed
### Misc
1. Removed some old features that don't do anything anymore

## Version 0.35.0
### New Features
1. Disable full card art setting
1. Added Volume Slider for Game Found sound
1. More Api
  <extended>
    1. ready: boolean
    1. addStyle(...style: string): void
    1. plugin(name: string): RegisteredPlugin
      1. plugin.toast(data): toast
      1. plugin.logger
      1. plugin.events
      1. plugin.settings()
    1. appendCard() event
  </extended>
### Fixes
1. Gold average works again
1. `@` now works in custom ping values
1. Tip styling arrow (online friends list)
1. Fixed `/scroll` giving an error
### Misc
1. Removed `smooth scrolling deck` feature (it causes bugs, don't need it anymore)
1. Added note for streamer mode
1. More stability for opening large amounts of packs

## Version 0.34.1
1. Fixed battle log not showing card events

## Version 0.34.0
1. Fixed /spectate command
1. Fixed deck page squishing buttons
1. Fixed updater not working
1. Fixed battle log size issues
1. Changed the position of the game timer
1. Added some more API functions
  <extended>
    1. streamerMode(): boolean
    1. onPage(page): boolean
  </extended>

## Version 0.33.1
1. Fixed revealing packs
1. Fixed crafting max cards
1. Fixed highlighting craftable cards

## Version 0.33.0
Happy new year!
### New Features
1. You can now change the color of friends
1. Error toast when the queue mess up (you get disconnected)
1. Added a few simple APIs
  <extended>
    `underscript.`
    1. openPacks
    1. eventManager
  </extended>
### Improvements
1. Improved pack opening (less likely to crash with over 2000 packs)
### Fixes
1. Fixed server-restart not being detected
1. Fixed removing cosmetics highlight in the menu
1. Fixed opponent tag setting not working

## Version 0.32.8
1. Updated for next season (again)

## Version 0.32.7
1. Updated for next season

## Version 0.32.6
1. Fixed battle log when spectating

## Version 0.32.5
1. Fix battle log soul color
1. Fixed miscellaneous errors

## Version 0.32.4
1. Fixed deck storage
1. Fixed various other issues on Decks page

## Version 0.32.3
I messed up the last changelog, so you get the old change log this time as well.
1. Fixed battle log error for next season
1. Fixed spam crafting with CTRL+Click
1. Fixed more bugs

## Version 0.32.2
1. Fixed battle log error for next season
1. Fixed spam crafting with CTRL+Click

## Version 0.32.1
1. Prep for next season
2. Fix menu getting covered by other stuff sometimes

## Version 0.32.0
### New Features
1. Make undercards tips pretty (by using our theme)
### Fixes
1. Fix emotes not getting toasted
1. Support animated avatars

## Version 0.31.1
1. Fixed tippy being an old version

## Version 0.31.0
### New Features
1. You can now disable in-game battle log
1. Added setting to disable header scrolling
### Fixes
1. In-game battle log no longer covers your avatar (Sorry 'bout that)
1. Possible fix for header scrolling leaving a bunch of lines on some computers (otherwise you can disable it now)

## Version 0.30.0
### New Features
1. Translations now have a preview
2. The header bar now scrolls with the page
### Fixes
1. Fixed card name in english setting (maybe)
2. Fixed quest name showing up when quests completed (hopefully)

## Version 0.29.0
### New Features
1. Added an Icon helper (Packs and such)
### Fixes
1. Pack count now decreases when opening all packs
1. You should no longer get as many invalid friend requests
### Misc.
1. Dust counter is now disabled by default

## Version 0.28.1
### Fixes
1. The deck hub no longer thinks you're always missing artifacts

## Version 0.28.0
### New Features
1. Added link to card editor under "Links"
1. You can now completely hide ignored messages
### Fixes
1. Skins toast properly again
### Misc.
1. You can now ignore balancers
1. You can access UnderScript's menu from UnderCards' menu
1. Updated code for next season

## Version 0.27.2
1. New color for <span class="friend">friends</span> in chat
1. Fix game patches not turning into toasts
1. Fix chat toast room name

## Version 0.27.1
1. Fixed card skin shop names looking small
1. Fixed local reset time
1. Fixed surrender/disconnect message in battle log

## Version 0.27.0
### New Features
1. Return of the "game found" notification

### Fixes
1. Winstreak toast displays properly (for real this time)

## Version 0.26.3
1. Fix quest notification
1. Fix home page translations
1. Fix legend user notification
1. Fix legendary card draw notification
1. Fix winstreak notification

## Version 0.26.2
1. Fix battle log (again)

## Version 0.26.1
1. Fix battle log and dust count

## Version 0.26.0
### New Features
1. Craft max with a hotkey (CTRL + Click)
1. Translation support
  1. Drop down menu to select specific pages
  1. Attempt to translate things UnderScript loads if possible
  1. Added setting to force card names to appear in English (no matter your language)

### Fixes
1. Fix card skin store not displaying cards correctly

## Version 0.25.2
1. Fixed /gg command

## Version 0.25.1
1. Fixed chat breaking

## Version 0.25.0
### New Features
1. Added settings to auto decline specific friend requests
1. Added toggle to lock custom games to friends
1. Automatically update the online friends list
1. Click on hovered cards (that shouldn't be there) to remove them
1. Chat will now scroll to the bottom more often
1. You can now disable minigames in the lobby
1. Chat commands~
  1. /scroll to scroll to the bottom of the chat
  1. /gg to send `@o good game`
  1. /spectate to send the spectate url
1. You can now turn off emotes in chat (will turn into text)
1. Added settings for disabling in-game emotes
1. Streamer mode
1. Leaderboard gets a touch of magic
  * Added a drop down menu for selecting specific pages
  * Added URLs to go directly to a page/user
  * Feedback when a user is not found

### Fixes
1. Fixed bug where the spectate list refreshes too quickly
1. Fixed shiny base cards showing as craftable when you can't afford it
1. Cards now have their correct description on the history log
1. Disabling scrolling on collection now works

## Version 0.24.2
1. Fixed chat breaking

## Version 0.24.1
1. Fixed @username not pinging you

## Version 0.24.0
### New Features
1. Added setting to stop April Fools Day

### Fixes
1. Updated chat to account for @
1. Fixed surrender button

## Version 0.23.6
1. Prepped for next season

## Version 0.23.1
1. Fixed updates going to the wrong URL

## Version 0.23.0
### New Features
1. Deck Storage now saves and loads artifacts
  * Note: You need to resave your decks to add artifacts to them
1. Added changelog
1. Added options for winstreak announcements
1. Added options for legend rank announcement
1. Jump to First/Last collection page
  * Control Click
1. Added option to disable changing collection page with scrollwheel
1. Added option to disable screen shaking
1. Added confirmation for ignoring users
1. @O now tags opponent
1. Can now decline all friend requests at once

### Fixes
1. Fixed the spectator list not resizing sometimes

## Version 0.22.9 (3/19/19)
1. Actually fix smart disenchanting

## Version 0.22.8 (3/17/19)
1. Smart Disenchant now works

## Version 0.22.7 (3/15/19)
1. Script now loads properly on crafting/deck page

## Version 0.22.6 (3/15/19)
1. Fix crafting features

## Version 0.22.5 (3/14/19)
1. Fix most of the deck features to work with 32.1
