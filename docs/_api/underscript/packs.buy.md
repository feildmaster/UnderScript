---
title: underscript.buyPacks()
categories: underscript
method: true
---
Buy packs. Only exists on the Packs page, so check for it first.

## Syntax
> underscript.buyPacks(*count*, { *type*, *gold* });

### Parameters
count
: Number of packs to buy, a whole number of at least 1

type
: Type of pack to buy: `''`, `'DR'`, or `'UTY'` (default: `''`)

gold
: `true` to pay with gold, `false` to pay with UCP (default: `true`)

An error is thrown if there is not enough gold or UCP.

## Examples
{% highlight javascript %}
underscript.onPage('Packs', () => {
  // Buy 5 packs with gold
  underscript.buyPacks(5);

  // Buy 3 deltarune packs with UCP
  underscript.buyPacks(3, { type: 'DR', gold: false });
});
{% endhighlight %}
