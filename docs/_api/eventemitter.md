---
title: EventEmitter
---
Events are how UnderScript tells your code that something happened, such as a page finishing loading or a chat message arriving. Plugins get one through [`plugin.events`]({{ site.baseurl }}{% link _api/plugin/events.md %}), and `underscript.utils.eventEmitter()` creates a new one for your own use.

## Methods
on(*event*, *listener*)
: Call `listener` every time `event` happens. Several events can be listened to at once by separating them with a space.

once(*event*, *listener*)
: Call `listener` the next time `event` happens, then stop. `one()` does the same thing.

until(*event*, *listener*)
: Call `listener` every time `event` happens, until it returns `true`.

off(*event*, *listener*)
: Stop calling `listener`.

emit(*event*, ...*data*)
: Tell everyone listening to `event`, passing `data` along. Returns `{ ran, canceled }`.

## Listener
The listener is called with the event's data. `this` is an object describing the event:

{% highlight javascript %}
{
  event,      // name of the event
  cancelable, // true if listeners may cancel it
  canceled,   // true once something canceled it, set it to cancel
  async,      // true if listeners may return promises
  delayed,    // true if the event already happened before you listened
  singleton,  // true if the event only happens once
}
{% endhighlight %}

## Emit options
Options are chained before `emit`:

{% highlight javascript %}
// Listeners can cancel this event
const { canceled } = events.emit.cancelable('myevent', data);

// Listeners can return promises to wait for
await events.emit.async('myevent', data);

// Chain them together
await events.emit.cancelable.async('myevent', data);
{% endhighlight %}

cancelable
: Listeners can set `this.canceled = true`. The result of `emit` tells you if they did.

canceled
: Start the event off as canceled. Listeners can change it back.

async
: `emit` returns a promise that waits for every listener that returned one.

singleton
: The event only happens once. Anyone who starts listening later still gets called, with the original data.

## Examples
{% highlight javascript %}
const events = underscript.utils.eventEmitter();

events.on('hello', function listener(name) {
  console.log(`Hello ${name}`, this.event); // Hello world hello
});
events.emit('hello', 'world');
{% endhighlight %}

Read the list of [events UnderScript emits]({{ site.baseurl }}{% link _api/events.md %}).
