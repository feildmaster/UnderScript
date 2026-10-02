---
title: plugin.hotkey
categories: plugin
plugin: true
property: true
---
Register hotkeys: keys and mouse buttons that run your code.

## Syntax
> plugin.hotkey;

## Methods
register(*hotkey*)
: Start listening for a hotkey

unregister(*hotkey*)
: Stop listening for a hotkey

## Hotkeys
Create a hotkey with `underscript.utils.Hotkey`:

> new underscript.utils.Hotkey(*name*, *listener*, { *keys*, *clicks* });

bindKey(*key*), unbindKey(*key*)
: Add or remove a key, like `'Escape'` or `'e'`

bindClick(*button*), unbindClick(*button*)
: Add or remove a mouse button. Use `underscript.utils.mouse`: `Left`, `Middle`, `Right`, `Back`, `Forward`.

keybound(*key*), clickbound(*button*)
: `true` if the key or button is bound

All of these return the hotkey, so they can be chained.

## Examples
{% highlight javascript %}
const plugin = underscript.plugin('My great plugin');
const { Hotkey, mouse } = underscript.utils;

const hotkey = new Hotkey('Say hello', () => console.log('Hello'))
  .bindKey('h')
  .bindClick(mouse.Middle);
plugin.hotkey.register(hotkey);
{% endhighlight %}
