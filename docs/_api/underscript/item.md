---
title: underscript.item
categories: underscript
property: true
---
Names for the things that can be rewarded or spent in the game. Compare against these instead of writing the text yourself.

## Syntax
> underscript.item.*NAME*;

GOLD, UCP, DUST, EXP, ELO, DT_FRAGMENT
: Currencies and rewards

UT_PACK, DR_PACK, UTY_PACK, SHINY_PACK, SUPER_PACK, FINAL_PACK
: Packs

CARD, SKIN, AVATAR, EMOTE, PROFILE
: Cosmetics and cards

Every item has `equals(other)`, and turns into text when used as one.

## Examples
{% highlight javascript %}
const { item } = underscript;
if (item.GOLD.equals('gold')) {
  console.log('Gold!');
}
{% endhighlight %}

# underscript.priority
Used when a filter or similar decides what goes first: `FIRST`, `HIGHEST`, `HIGH`, `NORMAL`, `LOW`, `LOWEST`, `LAST`. Like items, they have `equals(other)`, and anywhere one is accepted you can also pass its name as text, such as `'high'`.
