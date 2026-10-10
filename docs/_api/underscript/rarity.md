---
title: underscript.rarity
categories: underscript
property: true
---
Names for card rarities. Compare against these instead of writing the text yourself. Anywhere one is accepted you can also pass its name as text, such as `'EPIC'`.

## Syntax
> underscript.rarity.*NAME*;

BASE, COMMON, RARE, EPIC, LEGENDARY
: Card rarities

DETERMINATION
: DT cards. Also known as `'DT'`.

TOKEN
: Cards that can't be crafted. Also known as `'GENERATED'`.

Every rarity has `equals(other)`, and turns into the game's text for that rarity when used as text. To turn text into a rarity, or check if something is one, use [underscript.constants]({{ site.baseurl }}{% link _api/underscript/constants.md %}).

## Examples
{% highlight javascript %}
const { rarity } = underscript;
const { utils } = underscript;

if (rarity.DETERMINATION.equals(card.rarity)) {
  console.log('A DT card!');
}

utils.rarity.max(rarity.EPIC); // 2
utils.rarity.max('DT'); // 1
{% endhighlight %}
