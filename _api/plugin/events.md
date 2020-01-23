---
title: plugin.events()
plugin: true
method: true
---
Listen to and emit events.

## Syntax
> plugin.events();

## Event Methods
* on(*event*, *data*)
* emit(*event*, *data*, *options*)

## Examples
```javascript
const plugin = underscript.plugin('My great plugin');
const eventManager = plugin.events();
eventManager.on(':load', () => console.log('Page finished loading'));

// Call a custom event
eventManager.emit('customevent', {foo: 'bar'});
eventManager.on('customevent', (data) => console.log(data.foo)); // output: bar
```