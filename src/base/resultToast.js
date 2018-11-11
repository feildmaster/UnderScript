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
  if (!localStorage.getItem('setting.disableResultToast') && fn.toast(toast)) {
    BootstrapDialog.closeAll();
  }
});
