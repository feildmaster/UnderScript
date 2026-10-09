---
title: underscript.constants
categories: underscript
property: true
---
Helpers for working with [items]({% link _api/underscript/item.md %}), [priorities]({% link _api/underscript/priority.md %}) and [rarities]({% link _api/underscript/rarity.md %}) when you are not sure what you were given. They accept an item, priority or rarity, or the text for one, like `'gold'`, `'high'` or `'DT'`.

## Syntax
> underscript.constants.getItem(*value*);<br>
> underscript.constants.isItem(*value*);<br>
> underscript.constants.getPriority(*value*);<br>
> underscript.constants.isPriority(*value*);<br>
> underscript.constants.getRarity(*value*);<br>
> underscript.constants.isRarity(*value*);

getItem
: Returns the matching `underscript.item`, or `undefined` if there isn't one.

isItem
: `true` if the value is an item, or the text for one.

getPriority
: Returns the matching [`underscript.priority`]({% link _api/underscript/priority.md %}), or `undefined` if there isn't one.

isPriority
: `true` if the value is a priority, or the text for one.

getRarity
: Returns the matching [`underscript.rarity`]({% link _api/underscript/rarity.md %}), or `undefined` if there isn't one.

isRarity
: `true` if the value is a rarity, or the text for one.

## Examples
{% highlight javascript %}
const { constants, item } = underscript;

constants.getItem('gold') === item.GOLD; // true
constants.isItem('not an item'); // false

constants.getPriority('high') === underscript.priority.HIGH; // true

constants.getRarity('DT') === underscript.rarity.DETERMINATION; // true
{% endhighlight %}
