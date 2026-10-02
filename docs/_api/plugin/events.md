---
title: plugin.events()
categories: plugin
plugin: true
method: true
---
Listen to and emit events.

## Syntax
> plugin.events();

## Event Methods
<a href="{% link _api/eventemitter.md %}">Read more</a>
* on(*event*, *data*)
* emit(*event*, *data*, *options*)

## Examples
{% highlight javascript %}
const plugin = underscript.plugin('My great plugin');
const eventManager = plugin.events();
eventManager.on(':load', () => console.log('Page finished loading'));

// Call a custom event
eventManager.emit('customevent', {foo: 'bar'});
eventManager.on('customevent', (data) => console.log(data.foo)); // output: bar
{% endhighlight %}