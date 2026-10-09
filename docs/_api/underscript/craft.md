---
title: underscript.craft
categories: underscript
property: true
---
Settings for crafting and disenchanting. Only exists on the Crafting page, so check for it first.

## Syntax
> underscript.craft.bypassProtection(*value*);

bypassProtection
: UnderScript stops a craft or disenchant from starting while another one is still going, so double clicking a button doesn't do it twice. Pass `true` to turn that protection off, so your plugin can start several at once, and `false` to turn it back on. It is on by default.

## Examples
{% highlight javascript %}
if (underscript.craft) {
  // Let this plugin craft without waiting for the last craft to finish
  underscript.craft.bypassProtection(true);
}
{% endhighlight %}
