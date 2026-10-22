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
  *category*,
  *refresh*,
  *disabled*,
  *hidden*,
  *remove*,
  *reset*,
  *export*,
  *extraPrefix*,
  *data*,
  *transform*,
  *onChange*,
  *converter*,
<br>});

key: `string`
: Setting key, required. UnderScript adds your plugin's name to the front, so keys never clash with other plugins.

name: `string` or `function(): string`
: Name shown in the settings window (default: the key)

type: `string`, `object` or a custom type
: Type of setting (default: `boolean`).<br>
See [Setting Types](#setting-types)

default: `any` or `function(): any`
: Default setting value

note: `string` or `function(): string`
: Shown when hovering over the setting

description: `string` or `function(): string`
: Longer text shown under the setting

category: `string`
: Groups the setting under a titled box on your plugin's page. Settings with the same category share a box.

refresh: `boolean` or `function(): boolean`
: True to append "Will require you to refresh the page" to your setting's note

disabled: `boolean` or `function(): boolean`
: True to disable the setting

hidden: `boolean` or `function(): boolean`
: True to register the setting without showing it in the settings window

remove: `boolean` or `function(): boolean`
: For type `boolean`. True to delete the stored value when the box is unchecked, instead of storing `0`

reset: `boolean` or `function(): boolean`
: Adds a reset button (sets to default)

export: `boolean` or `function(): boolean`
: False to leave the setting out of exports (default: true)

extraPrefix: `string`
: Exports also include every stored key that starts with this prefix. For data you keep in `localStorage` outside of settings, but want to associate with the setting.

data: `any` or `function(): any`
: Extra data for the setting type. What it should be depends on the type, see [Setting Types](#setting-types). Custom types from [addType()](#addtype) read it too.

transform: `function(value): any`
: Changes the value before you receive it, for the default value too. The stored value is not changed.<br>
`value()`, `on()` and `onChange` all get the transformed value.

onChange: `function(newValue, oldValue): void`
: Called when the setting value is changed

converter: `function(stored): any`
: Runs once when the setting is registered, and only if a value is stored. Receives the stored string.<br>
Return a new value to store, `null` to remove the stored value, or `undefined` to leave it as is. Useful for migrating values from an older format.

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

A type needs `element()`, which builds what the player interacts with, and `value()`, which turns the stored string into the value your plugin receives. You can also override `default()`, `encode()`, `styles()` and `labelFirst()`.

element(*value*, *update*, *info*)
: `value` is the current value. Call `update(newValue)` to change it, or `update(undefined)` to delete it.<br>
`info` has `data` (the setting's `data`), `key` (the full key), `name`, `disabled`, `remove`, `container` (an element placed under the setting that you can fill), and `removeSetting()` (deletes the setting completely).

value(*stored*, *data*)
: Return the value type this setting is meant to have.

## Setting Types
boolean
: Checkbox (true/false) (default).<br>
`data`: `{ reverse, extraValue }`. `reverse` flips the value, so unchecked is `true`. `extraValue` is one more stored value to count as `true`.

select
: Drop down menu.<br>
`data`: the items to choose from, each a value or `[label, value]`, like `['Low', ['High', 'h']]`

text
: A text box

password
: A text box that hides what you type

color
: Color selector

slider
: A sliding bar.<br>
`data`: `{ min, max, step }` (defaults 0, 100 and 1)

keybind
: Click and press a key or mouse button.<br>
`data`: `{ labels }`, an object of key names to the text shown for them

array
: A list of text you can add to and remove from. Type in the box and press Enter to add an item, and click an item to remove it. The value is an array of strings.

list
: The items in `data`, which the player drags into the order they want.<br>
`data`: the items, each a string or an object `{ label, value, class }`. `label` is the text shown (`text` also works), `value` is what gets stored (default: the label), and `class` adds CSS classes to the item. `value()` gives back the items themselves, in order, so an object item comes back as an object. Items you add to `data` later go to the end of an existing order.

map
: Pairs of keys and values

{ key, value }
: Pass an object as the `type` for a map with typed keys and values, like `type: { key: 'text', value: 'color' }`. `key` defaults to `text`, and `value` defaults to the type of `key`.

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
  data: { min: 0, max: 10 },
  default: 2,
});
{% endhighlight %}

Migrating a stored value to a new format
{% highlight javascript %}
const delay = settings.add({
  key: 'delay',
  name: 'Delay (seconds)',
  type: 'slider',
  data: { min: 0, max: 10 },
  default: 2,
  converter(stored) {
    if (!stored.endsWith('s')) return undefined;
    return Number(stored.slice(0, -1));
  },
});
{% endhighlight %}

A custom type
{% highlight javascript %}
class Stars extends underscript.utils.SettingType {
  constructor() {
    super('stars');
  }

  element(value, update, { data = 5 }) {
    return $('<input type="number">')
      .attr({ min: 1, max: data })
      .val(value)
      .on('change', (e) => update(e.target.value));
  }

  value(stored) {
    return Number(stored);
  }

  default() {
    return 1;
  }
}

const stars = new Stars();
settings.addType(stars);
settings.add({
  key: 'rating',
  name: 'Rating',
  type: stars,
  data: 10,
});
{% endhighlight %}
