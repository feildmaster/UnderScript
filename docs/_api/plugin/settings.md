---
title: plugin.settings()
categories: plugin
plugin: true
method: true
---
Provides access to the settings API.

## Syntax
> plugin.settings();

Return Value
: [`RegisteredSetting`](#registered-setting) object

## Methods
### add()
Add a setting to the UnderScript settings window.
> settings.add({<br>&nbsp;&nbsp;&nbsp;&nbsp;
  *key*,
  *name*,
  *type*,
  *note*,
  *refresh*,
  *disabled*,
  *default*,
  *options*,
  *reset*,
  *onChange*,
  *export*,
  *min*,
  *max*,
  *step*,
<br>});

key: `string`
: Setting key, required

name: `string`
: Setting name

type: `string`
: Type of setting, (default: `boolean`, `select` if `options` exist).<br>
See [Setting Types](#setting-types)

note: `string` or `function(): string`
: Show note when hovering over setting

refresh: `boolean` or `function(): boolean`
: True to append "Will require you to refresh the page" to your setting's note

disabled: `boolean` or `function(): boolean`
: True to disable setting

default: `string` or `any`
: Default setting value

reset: `boolean`
: Adds a reset button (sets to default)

onChange: `function(newValue, oldValue): void`
: Called when setting value is changed

export: `boolean` or `function(): boolean`
: False to disable exporting (default: true)<br>
**Note**: Exporting not enabled

hidden: `boolean`
: True to register setting, but not show it in the setting window. Useful for exporting.

options: `Array`
: For type `select`. Array of items to select from.

min: `number`
: For type `slider`. Minimum number for range selection (default: 0)

max: `number`
: For type `slider`. Max number for range selection (default: 100)

step: `number`
: For type `slider`. Amount to change between values in range (default: 1)

### on()
Register an event listener to trigger when a setting changes
> settings.on(*setting name*, *data*);

Read more: [EventEmitter]({% link _api/eventemitter.md %})

### isOpen()
> settings.isOpen();

## Setting Types
boolean
: Checkbox (true/false) (default)

select
: Drop down menu

remove
: Deletes itself when selected

array
: Stores an array of data, each item is displayed as a "remove" setting

slider
: A sliding bar

color
: Color selector

## Registered Setting
{% highlight javascript %}
RegisteredSetting {
  key, // Output: key for setting
  value(), // Get current value
  set(), // Set value to newValue, NOTE: currently bugged (bypasses events and checks)
}
{% endhighlight %}

## Examples
{% highlight javascript %}
// TODO
{% endhighlight %}
