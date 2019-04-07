settings.register({
  name: 'Disable Screen Shake',
  key: 'underscript.disable.rumble',
  options: ['Never', 'Always', 'Spectate'],
  type: 'select',
  page: 'Game',
});

eventManager.on('GameStart', function rumble() {
  eventManager.on(':loaded', () => {
    const spectating = onPage('gameSpectate');
    globalSet('shakeScreen', function(...args) {
      if (!disabled()) this.super(...args);
    });

    function disabled() {
      switch(settings.value('underscript.disable.rumble')) {
        case 'Spectate': return spectating;
        case 'Always': return true;
        default: return false;
      }
    }
  });
});
