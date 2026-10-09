---
title: plugin.toast()
categories: plugin
plugin: true
method: true
---
Allow plugins to send toasts. A toast is a small message in the corner of the page. The footer shows the name of your plugin.

## Syntax
> plugin.toast(*text*);<br>
> plugin.toast({ *text*, ... });

text
: What the toast says. It can contain HTML.

### Options
text: `string`
: The message, required

title: `string`
: Title shown above the message

footer: `string`
: Text shown in front of your plugin's name in the footer

timeout: `number`
: Milliseconds before the toast closes on its own

error: `boolean`
: Show the toast as an error

className: `string` or `string[]` or `{ toast, button }`
: Classes to add to the toast, or to its buttons

buttons: `object` or `object[]`
: Buttons to show, each with `text` (required), `className`, `onClick(event, toast)`, and `dismiss`. Clicking a button closes the toast, set `dismiss: false` or call `event.preventDefault()` in `onClick` to keep it open.

onClose: `function(reason, toast)`
: Called after the toast closes. `reason` is `timeout`, `dismissed`, or what was passed to `close()`.

Return Value
: Returns a `Toast` object
{% highlight javascript %}
Toast {
  exists(), // true if the toast is still showing
  element, // the toast's element
  setText(text), // change the message
  setTitle(title), // change the title
  setFooter(text), // change the text shown in front of your plugin's name
  close(reason), // close the toast
}
{% endhighlight %}

## Examples
{% highlight javascript %}
plugin.toast('Hello!');

const toast = plugin.toast({
  title: 'Working',
  text: 'Please wait...',
  timeout: 5000,
});
toast.setText('Almost done...');

plugin.toast({
  text: 'Saved. Undo?',
  buttons: {
    text: 'Undo',
    onClick(event, toast) {
      toast.close('undone');
    },
  },
  onClose(reason) {
    console.log(reason);
  },
});
{% endhighlight %}
