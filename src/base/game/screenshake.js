settings.register({
  name: 'Disable Screen Shake',
  key: 'underscript.disable.rumble',
  options: ['Never', 'Always', 'Spectate'],
  type: 'select',
  page: 'Game',
});

eventManager.on('GameStart', function rumble() {
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
