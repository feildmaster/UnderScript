wrap(() => {
  const setting = settings.register({
    name: 'Disable Scrolling Collection Pages Hotkey (mousewheel)',
    key: 'underscript.disable.scrolling',
    refresh: onPage('Decks') || onPage('Crafting'),
    page: 'Library',
  });

  if (onPage('Decks') || onPage('Crafting')) {
    eventManager.on(':loaded', function scrollwheelLoaded() {
      globalSet('onload', function () {
        this.super && this.super();
        if (setting.value()) $('#collection').off('mousewheel DOMMouseScroll');
      });
    });
  }
});
