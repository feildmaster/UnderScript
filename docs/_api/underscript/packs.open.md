---
title: underscript.openPacks()
categories: underscript
method: true
---
Opens packs and outputs the results (via toast).

## Syntax
> underscript.openPacks(*count*, *type*);

### Parameters
count
: Number of packs to open

type
: Type of pack to open ('', 'DR', 'Shiny', 'Super', 'Final') (default: '')

## Examples
{% highlight javascript %}
// Open 10 packs
undescript.openPacks(10);

// Open 5 deltarune packs
undescript.openPacks(5, 'DR');
{% endhighlight %}
