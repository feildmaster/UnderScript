settings.register({
  name: 'Disable Result Toast',
  key: 'underscript.disable.resultToast',
});

eventManager.on('getResult:before', function resultToast() {
  if (settings.value('underscript.disable.resultToast')) return;
  // We need to mark the game as finished (like the source does)
  finish = true;
  this.canceled = true;
  const toast = {
    title: 'Game Finished',
    text: 'Return Home',
    buttons: {
      className: 'skiptranslate',
      text: '🏠',
    },
    css: {
      'font-family': 'inherit',
      button: { background: 'rgb(0, 0, 20)' }
    },
    onClose: () => {
      document.location.href = "/";
    },
  };
  fn.toast(toast);
});
