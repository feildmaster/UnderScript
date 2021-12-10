wrap(() => {
  const setting = settings.register({
    name: 'Disable Error Toast',
    key: 'underscript.disable.errorToast',
    page: 'Game',
  });

  eventManager.on('getError:before getGameError:before', function toast(data) {
    if (setting.value() || this.canceled) return;
    this.canceled = true;
    fn.errorToast({
      title: $.i18n('dialog-error'),
      text: global('translateFromServerJson')(data.message),
      onClose() {
        document.location.href = 'Play';
      },
    });
  });
});
