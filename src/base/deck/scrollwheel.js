settings.register({
  name: 'Disable Scrolling Collection Pages Hotkey (mousewheel)',
  key: 'underscript.disable.scrolling',
  refresh: onPage('Decks') || onPage('Crafting'),
});

if (onPage('Decks') || onPage('Crafting')) {
  eventManager.on('jQuery', () => {
    $('#collection').off('mousewheel DOMMouseScroll');
  });
}
