hotkeys.push(new Hotkey("Open Menu")
  .run((e) => {
    if (typeof BootstrapDialog !== 'undefined' && Object.keys(BootstrapDialog.dialogs).length) {
      return;
    }
    if (menu.isOpen()) {
      menu.close();
    } else {
      menu.open();
    }
  })
  .bindKey(27));
