---
title: underscript.utils
categories: underscript
property: true
---
Helpers that UnderScript uses itself.

## Syntax
> underscript.utils;

## General
each(*object*, *callback*), some(*object*, *callback*)
: Loop over an array, or the keys of an object, like `forEach` and `some`

sleep(*ms*, *value*)
: A promise that waits, then resolves with `value`

shuffle(*array*)
: Shuffle an array

rand(*max*, *min*, *inclusive*)
: A random whole number

notify(*text*, *title*)
: Show a desktop notification

translateText(*text*, { *args*, *fallback*, *locale* })
: Translate a game text key, filling in `args`. `locale` translates as a specific language.

## The page
global(*...keys*)
: Read variables from the game's page. Pass `{ throws: false }` last to get `undefined` instead of an error.

globalSet(*key*, *value*)
: Replace a variable or function on the game's page. A replaced function can call the original with `this.super()`.

hover
: Tooltips. `hover.tip(text, target, options)` adds a tooltip to elements, `hover.show(data)` and `hover.hide()` show or hide one by hand.

## Building things
eventEmitter()
: Create an [EventEmitter]({% link _api/eventemitter.md %})

Hotkey, mouse
: See [plugin.hotkey]({% link _api/plugin/hotkey.md %})

SettingType
: Make your own type of setting for [plugin.settings().addType()]({% link _api/plugin/settings.md %})

tabManager()
: Build a page of tabs. `addTab(name, content)` adds one and `render(true)` gives you the element to put on the page. Tabs that don't fit on one row split into pages with arrows. `settings({ labels, tooltip })` changes the text of the arrows' tooltips (`labels.previous(page, total)`, `labels.next(page, total)`), or sets `tooltip` to `underscript.utils.hover` to use UnderScript's hover instead of a plain `title`.

VarStore
: Holds a value. `consume()` reads it and puts the default back.

rarity
: `max(rarity)`, `cost(rarity, shiny)` and `dust(rarity, shiny)` for card rarities. A rarity is its name, like `'EPIC'`, or an [`underscript.rarity`]({% link _api/underscript/rarity.md %}).

## Examples
{% highlight javascript %}
const { sleep, rand } = underscript.utils;
sleep(1000).then(() => console.log(rand(10)));
{% endhighlight %}
