---
title: plugin.addStyle()
categories: plugin
plugin: true
method: true
---
Add CSS to the document.

## Syntax
> plugin.addStyle(...styles);

...styles
: Styles to add to the document

Return Value
: Returns `Style` object
{% highlight javascript %}
Style {
  remove(),
  replace(...styles),
  append(...styles),
}
{% endhighlight %}

## Examples
{% highlight javascript %}
const style = plugin.addStyle('.style1 {}'); // Styles: .style1
style.remove(); // Styles: none
style.replace('.style2 {}'); // Styles: .style2
style.append('.style3 {}', '.style4 {}'); // Styles: .style2, .style3, .style4
{% endhighlight %}
