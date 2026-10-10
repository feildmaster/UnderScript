---
title: underscript.priority
categories: underscript
property: true
---
Names for deciding what goes first, used when a filter or similar has to be put in order. Anywhere one is accepted you can also pass its name as text, such as `'high'`.

## Syntax
> underscript.priority.*NAME*;

FIRST, HIGHEST, HIGH, NORMAL, LOW, LOWEST, LAST
: From going first to going last. `FIRST` is also known as `'top'` and `LAST` as `'bottom'`.

Every priority has `equals(other)`. To turn text into a priority, or check if something is one, use [underscript.constants]({{ site.baseurl }}{% link _api/underscript/constants.md %}).

## Examples
{% highlight javascript %}
const { onPage, priority } = underscript;
const plugin = underscript.plugin('My great plugin');

if (onPage('Decks') || onPage('Crafting')) {
  // Run this filter before the others
  plugin.addFilter((card) => card.cost > 5, priority.HIGH);

  // The name as text works too
  plugin.addFilter((card) => card.cost > 5, 'high');
}
{% endhighlight %}
