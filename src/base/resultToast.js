settings.register({
  name: 'Disable Result Toast',
  key: 'underscript.disable.resultToast',
});

eventManager.on('getResult', function resultToast() {
  if (settings.value('underscript.disable.resultToast')) return;
  const toast = {
    title: 'Game Finished',
    text: 'Return Home',
    buttons: {
      className: 'skiptranslate',
      text: '🏠',
    },
    css: {'font-family': 'inherit'},
    onClose: () => {
      document.location.href = "/";
    },
  };
  if (fn.toast(toast)) {
    BootstrapDialog.closeAll();
  }
});
