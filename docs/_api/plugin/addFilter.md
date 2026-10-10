---
title: plugin.addFilter()
categories: plugin
plugin: true
method: true
---
Add your own filter to the collection on the Decks and Crafting pages. On any other page `addFilter` does not exist, so check for it first.

## Syntax
> plugin.addFilter(*filter*, *priority*);

filter
: `function(card, removed, results)`. Called for every card.
* `card` is the card
* `removed` is `true` if another filter already hid the card
* `results` is what earlier filters decided, by name

Return `true` to hide the card, `false` to show it, or nothing to leave it alone.

priority
: When to run, compared to other filters: [`underscript.priority.HIGH`]({{ site.baseurl }}{% link _api/underscript/priority.md %}), or the name as text, `'high'`. (default: normal)

## Examples
{% highlight javascript %}
const { onPage } = underscript;
const plugin = underscript.plugin('My great plugin');

if (onPage('Decks') || onPage('Crafting')) {
  plugin.addFilter((card) => card.cost > 5);
}
{% endhighlight %}
