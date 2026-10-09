---
title: plugin.events
categories: plugin
plugin: true
property: true
---
Listen to and emit events. `plugin.events` is UnderScript's [EventEmitter]({% link _api/eventemitter.md %}), so events you emit can be heard by other plugins. Errors thrown by your listeners are caught and written to your plugin's [logger]({% link _api/plugin/logger.md %}) instead of breaking other listeners.

## Syntax
> plugin.events;

## Methods
on(*event*, *listener*)
: Listen to an event

once(*event*, *listener*), one(*event*, *listener*)
: Listen to an event, once

until(*event*, *listener*)
: Listen to an event until the listener returns `true`

off(*event*, *listener*)
: Stop listening

compound(...*events*, *listener*)
: Call `listener` once every one of the events has happened. Needs at least two events.

emit(*event*, ...*data*)
: Emit an event. Chain `.cancelable`, `.canceled`, `.singleton` or `.async` before it to change how it behaves.

Read more: [EventEmitter]({% link _api/eventemitter.md %}). See the [list of events]({% link _api/events.md %}).

## Examples
{% highlight javascript %}
const plugin = underscript.plugin('My great plugin');
const events = plugin.events;
events.on(':load', () => console.log('Page finished loading'));

// Call a custom event
events.emit('customevent', { foo: 'bar' });
events.on('customevent', (data) => console.log(data.foo)); // output: bar

// Wait for two things to happen
events.compound('allCardsReady', ':load', () => console.log('Both happened'));
{% endhighlight %}
