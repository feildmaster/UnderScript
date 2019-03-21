settings.register({
  name: 'Disable Screen Shake',
  key: 'underscript.disable.rumble',
  options: ['Never', 'Always', 'Spectate'],
  type: 'select',
  page: 'Game',
});

eventManager.on('GameStart', function rumble() {
  eventManager.on(':loaded', () => {
    if (typeof shakeScreen !== 'function') fn.debug("You're an idiot");
    const spectating = onPage('gameSpectate');
    const oRumble = shakeScreen;
    shakeScreen = () => {
      if (!disabled()) oRumble();
    };

    function disabled() {
      switch(settings.value('underscript.disable.rumble')) {
        case 'Spectate': return spectating;
        case 'Always': return true;
        default: return false;
      }
    }
  });
});
