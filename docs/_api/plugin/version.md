---
title: plugin.version
categories: plugin
plugin: true
property: true
---
The version of your plugin. Only exists when you passed one to `underscript.plugin(name, version)`.

## Syntax
> plugin.version;

## Examples
{% highlight javascript %}
const plugin = underscript.plugin('My great plugin', '1.2.0');
console.log(plugin.version); // 1.2.0
{% endhighlight %}
