---
title: underscript.openPacks()
categories: underscript
method: true
---
Opens packs and outputs the results (via toast). Only one set of packs can be opened at a time, it throws an error if packs are already being opened.

## Syntax
> underscript.openPacks(*count*, *type*);

### Parameters
count
: Number of packs to open

type
: Type of pack to open ('', 'DR', 'UTY', 'Shiny', 'Super', 'Final') or its [item]({{ site.baseurl }}{% link _api/underscript/item.md %}), like `underscript.item.DR_PACK` (default: '')

## Checking if packs are opening
> underscript.openingPacks();

Returns `true` while packs are being opened, and `false` when they are not. Check it before calling `openPacks()`.

## Examples
{% highlight javascript %}
// Open 10 packs
underscript.openPacks(10);

// Open 5 deltarune packs
underscript.openPacks(5, 'DR');

// Same thing, with an item
underscript.openPacks(5, underscript.item.DR_PACK);

// Wait for other packs to finish first
if (!underscript.openingPacks()) {
  underscript.openPacks(3);
}
{% endhighlight %}
