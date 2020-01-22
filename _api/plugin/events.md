---
title: plugin.events()
plugin: true
method: true
---
Listen to and emit events.

## Syntax
> plugin.events();

## Methods
* on
* emit

## Examples
```javascript
const plugin = underscript.plugin('My great plugin');
const eventManager = plugin.events();
eventManager.on(':load', () => console.log('Page finished loading'));

// Call a custom event
eventManager.emit('customevent', {foo: 'bar'});
eventManager.on('customevent', (data) => console.log(data.foo)); // output: bar
```