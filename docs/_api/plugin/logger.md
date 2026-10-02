---
title: plugin.logger
categories: plugin
plugin: true
property: true
---
The logger writes to the console, prefixed with the name of your plugin.

## Syntax
> plugin.logger;

## Methods
* info(...*data*)
* log(...*data*)
* warn(...*data*)
* error(...*data*)
* debug(...*data*)

## Examples
{% highlight javascript %}
plugin.logger.info('Loaded', { cards: 25 });
plugin.logger.error(new Error('Something went wrong'));
{% endhighlight %}
