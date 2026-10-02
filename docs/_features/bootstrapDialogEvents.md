---
title: BootstrapDialog Events
date: 2021-07-19
version: 0.46.0
deprecated: false
banner: 
credit: CMD_God
notice: 
---
UnderScript wraps BootstrapDialog in a way that all of their dialog events call an event in the EventManager.

## Events
All events have access to the `dialog` instance.
1. `BootstrapDialog:create`: Created dialog
3. `BootstrapDialog:preshow`: Before `dialog.show()` gets processed
    - Cancelable 
4. `BootstrapDialog:show`: in the process of rendering
5. `BootstrapDialog:shown`: finished rendering on screen
6. `BootstrapDialog:hide`: in the process of hiding
7. `BootstrapDialog:hidden`: finished hiding

## Examples
```javascript
plugin.events().on('BootstrapDialog:create', (dialog) => {
  // Do stuff here, `dialog` was created.
});

plugin.events().on('BootstrapDialog:preshow', function (dialog) {
  // Do stuff here, `dialog` is being shown.
  this.canceled = true; // Now it wont show.
});
```
