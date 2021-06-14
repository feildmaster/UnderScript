wrap(function minigames() {
  const setting = settings.register({
    name: 'Disable',
    key: 'underscript.minigames.disabled',
    page: 'Lobby',
    refresh: onPage('Play'),
    category: 'Minigames',
  });

  onPage('Play', () => {
    eventManager.on(':loaded', () => {
      globalSet('onload', function onload() {
        window.game = undefined; // gets overriden if minigame loads
        window.saveBest = noop(); // gets overriden if minigame loads
        if (setting.value()) {
          debug('Disabling minigames');
          globalSet('mobile', true);
        }
        this.super();
        if (setting.value()) globalSet('mobile', false);
      });
    });
  });
});
