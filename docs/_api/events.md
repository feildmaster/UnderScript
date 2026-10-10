---
title: Events
---
Events UnderScript emits. Listen to them with [`plugin.events`]({{ site.baseurl }}{% link _api/plugin/events.md %}). Data shown as `unknown` is game data that UnderScript passes along as it received it.

## Page lifecycle
`:preload`
: The page's HTML finished loading (DOM ready). Images and other resources may still be loading. This only happens once, and plugins that start listening late still get called.

`:load`
: The whole page finished loading, including images. Also only happens once.

`:unload`
: The page is closing

`:preload:PAGE`, `:load:PAGE`, `:unload:PAGE`
: The same events, but only on one page. `PAGE` is the page name, such as `Packs` or `Decks`.

`underscript:ready`
: UnderScript's own assets (like translations) finished loading

`translation:loaded`, `translation:underscript`
: Translations finished loading

`login`(*id*, *username*), `logout`
: The user logged in or out

`jQuery`(*jQuery*)
: jQuery is available

`undercards:season`(*season*)
: The current season is known

`:update`, `:update:finished`, `:update:force`
: UnderScript checks for updates

`:menu:opening`
: The UnderScript menu is about to open

`:GuestMode`
: The user is not logged in

`window:active`
: The window gained focus

`ShowPage`(*page*), `preShowPage`(*page*)
: A page is about to be shown

`newElement`(*element*)
: Something was added to the page

`@autocomplete`({ *list* })
: Chat is building its list of names to suggest. Add names to `list`.

## Chat
`ChatDetected`
: Chat exists on this page

`Chat:Connected`, `Chat:Disconnected`, `Chat:Reconnected`
: The connection to chat changed

`Chat:getHistory`(*data*), `preChat:getHistory`(*data*)
: Chat history loaded

`Chat:getMessage`(*data*), `Chat:getPrivateMessage`(*data*)
: A message arrived. Every game chat event is available as `Chat:NAME` and `preChat:NAME`, and in custom games as `Custom:NAME` and `preCustom:NAME`.

`Chat:send`(*data*), `Chat:command`(*data*)
: The user sent a message or ran a command

`Chat:focused`(*data*), `Chat:unfocused`(*data*)
: A chat room gained or lost focus

`ChatMessage`(*data*), `preChatMessage`(*data*)
: A message is shown in chat

## Games
`GameStart`, `PlayingGame`
: A game started or is running

`GameEvent`(*data*), `PreGameEvent`(*data*)
: The game sent an event

`Play:Message`(*data*)
: A message from the game

`player:endTurn` (cancelable)
: The player is ending their turn

`enterCustom`
: Entered a custom game

`closeQueues`(*message*)
: The play queues closed

`Log:NAME`(*log*)
: A game log entry, one event per kind

`pre:NAME`(*data*), `NAME:before`(*data*), `func:NAME`, `pre:func:NAME`
: Hooks that run before or around the game's own events and functions

## Cards, decks and crafting
`allCardsReady`(*cards*)
: Every card has loaded

`Deck:Change`(*deck*), `Deck:postChange`(*deck*), `Deck:Loaded`(*data*), `Deck:Soul`(*soul*)
: The deck changed, loaded, or the soul changed

`Craft:Loaded`, `Craft:RefreshPage`(*page*, *previous*)
: The crafting page loaded or changed pages

`craftcard`({ *id*, *name*, *dust*, *shiny* })
: A card was crafted

`crafterrror`(*message*, *status*)
: Crafting a card failed. `message` and `status` come from the game's response.

`refreshhighlight`
: The craftable card highlights on the Crafting page are redrawn. Emit it to refresh them yourself.

`openedPacks`({ *count*, *cards* })
: Packs were opened

`questProgress`(*updated*, *previous*)
: Quest progress changed. Both are lists of [quests]({{ site.baseurl }}{% link _api/plugin/quests.md %}).

`Home:Refresh`
: The home page refreshed its game list

## Friends
`Friends:pending`(*pending*), `Friends:requests`(*requests*), `preFriends:requests`(*requests*)
: Friend requests changed

`friendAction`(*element*)
: A friend request was accepted or declined

`Friendship:load`, `Friendship:loaded`, `Friendship:page`(*page*), `Friendship:claim`(*result*), `Friendship:results`(*error*)
: Friendship page events

## Leaderboard
`Rankings:init`
: The leaderboard finished loading

`Rankings:selectPage`(*page*)
: A page was picked from the page dropdown

## Windows and settings
`BootstrapDialog:create`(*dialog*), `BootstrapDialog:preshow`(*dialog*)
: A dialog is about to show. The dialog is not on the page yet.

`BootstrapDialog:show`, `shown`, `hide`, `hidden`
: The dialog's own events, given the dialog

`Settings:open`(*body*)
: The settings window opened. `body` is a jQuery object.

`setting:change`(*key*, *value*, *previous*), `open`, `close`
: Events on [`plugin.settings().on()`]({{ site.baseurl }}{% link _api/plugin/settings.md %})
