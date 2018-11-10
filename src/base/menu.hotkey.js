if (typeof BootstrapDialog !== 'undefined') {
  hotkeys.push(new Hotkey("Open Menu")
    .run((e) => {
      // TODO: check if bootstrap (any) is open
      if (settings.isOpen()) {
        return;
      }
      if (menu.isOpen()) {
        menu.close();
      } else {
        menu.open();
      }
    })
    .bindKey(27));
}
