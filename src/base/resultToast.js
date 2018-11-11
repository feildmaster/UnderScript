settings.register({
  name: 'Disable Result Toast',
  key: 'underscript.disable.resultToast',
});

eventManager.on('getResult', function resultToast() {
  const toast = {
    title: 'Game Finished',
    text: 'Return Home',
    buttons: {
      className: 'skiptranslate',
      text: '🏠',
    },
    onClose: () => {
      document.location.href = "/";
    },
  };
  if (!localStorage.getItem('underscript.disable.resultToast') && fn.toast(toast)) {
    BootstrapDialog.closeAll();
  }
});
