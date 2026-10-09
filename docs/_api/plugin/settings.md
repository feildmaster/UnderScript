---
title: plugin.settings()
categories: plugin
plugin: true
method: true
---
Provides access to the settings API. Your plugin gets its own page in the UnderScript settings window, under Plugins.

## Syntax
> plugin.settings();

Return Value
: A `Settings` object

## Methods
### add()
Add a setting to your plugin's page.
> settings.add({<br>&nbsp;&nbsp;&nbsp;&nbsp;
  *key*,
  *name*,
  *type*,
  *default*,
  *note*,
  *description*,
  *refresh*,
  *disabled*,
  *hidden*,
  *reset*,
  *onChange*,
  *options*,
  *min*,
  *max*,
  *step*,
<br>});

key: `string`
: Setting key, required. UnderScript adds your plugin's name to the front, so keys never clash with other plugins.

name: `string` or `function(): string`
: Name shown in the settings window (default: the key)

type: `string`
: Type of setting (default: `boolean`, or `select` if `options` exist).<br>
See [Setting Types](#setting-types)

default: `any` or `function(): any`
: Default setting value

note: `string` or `function(): string`
: Shown when hovering over the setting

description: `string` or `function(): string`
: Longer text shown under the setting

refresh: `boolean` or `function(): boolean`
: True to append "Will require you to refresh the page" to your setting's note

disabled: `boolean` or `function(): boolean`
: True to disable the setting

hidden: `boolean` or `function(): boolean`
: True to register the setting without showing it in the settings window

reset: `boolean` or `function(): boolean`
: Adds a reset button (sets to default)

export: `boolean` or `function(): boolean`
: False to leave the setting out of exports (default: true)

onChange: `function(newValue, oldValue): void`
: Called when the setting value is changed

options: `Array`
: For type `select`. The items to select from.

min, max, step: `number`
: For type `slider`. The range (default 0 to 100) and the amount to change by (default 1)

Return Value
: A `Setting` object
{% highlight javascript %}
Setting {
  key,        // the full key
  disabled,   // true if currently disabled
  value(),    // get the current value
  set(value), // change the value
  on(fn),     // fn(newValue, oldValue) when it changes
  show(),     // open the settings window on this setting
  refresh(),  // refresh the setting after changing what it depends on
}
{% endhighlight %}

### page()
Add a setting to a different tab of your plugin's page.
> settings.page(*name*);

Return Value
: An object with `add()` (the same as above) and `open()`. The tab shows up next to your plugin's first tab.

### name()
Rename the first tab of your plugin's page. Returns `true` if it was renamed.
> settings.name(*name*);

### value()
Get the value of any setting by its full key.
> settings.value(*fullKey*);

### on()
Listen for setting events.
> settings.on(*event*, *listener*);

`setting:change`(*key*, *value*, *previous*), `open`, `close`
: Events for the whole window. You can also pass the full key of a setting to listen to just that setting.

### open()
Open the settings window to your plugin's page.
> settings.open();

### isOpen()
Returns true if the settings window is open.
> settings.isOpen();

### addType()
Register your own type of setting, made with `underscript.utils.SettingType`. Its name gets your plugin name added to the front, `plugin name:type name`.
> settings.addType(*type*);

## Setting Types
boolean
: Checkbox (true/false) (default)

select
: Drop down menu

text
: A text box

password
: A text box that hides what you type

color
: Color selector

slider
: A sliding bar

keybind
: Click and press a key or mouse button

array
: Stores a list of data, each item is displayed as a "remove" setting

list
: A list of values you can add to and remove from

map
: Pairs of keys and values

remove
: Deletes itself when selected

hr
: A divider line

## Examples
{% highlight javascript %}
const plugin = underscript.plugin('My great plugin');
const settings = plugin.settings();

const enabled = settings.add({
  key: 'enabled',
  name: 'Enable my feature',
  description: 'Turns on the feature that does the thing',
  default: true,
  onChange(value) {
    console.log('Now', value);
  },
});

if (enabled.value()) {
  // Do the thing
}

// A second tab
settings.page('Advanced').add({
  key: 'delay',
  name: 'Delay',
  type: 'slider',
  min: 0,
  max: 10,
  default: 2,
});
{% endhighlight %}
