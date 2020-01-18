wrap(function streamer() {
  const silent = 'Yes (silent)';
  const disabled = 'No';
  const mode = settings.register({
    name: 'Enable?',
    key: 'underscript.streamer',
    note: 'Enables a button on the menu, streamer mode is "off" by default.',
    options: ['Yes', silent, disabled],
    default: disabled,
    onChange: (val) => {
      if (val === disabled) {
        update(false);
      } else {
        menu.dirty();
      }
    },
    type: 'select',
    category: 'Streamer Mode',
  });
  const setting = settings.register({
    key: 'underscript.streaming',
    hidden: true,
  });
  Object.defineProperty(script, 'streaming', {
    get: () => setting.value(),
  });
  api.register('streamerMode', () => setting.value());
  menu.addButton({
    text: () => `Streamer Mode: ${setting.value() ? 'On' : 'Off'}`,
    hidden: () => mode.value() === disabled,
    action: () => update(!setting.value()),
  });
  eventManager.on(':loaded', alert);

  function alert() {
    if (!setting.value() || mode.value() === silent) return;
    fn.toast('Streamer Mode Active');
  }

  function update(value) {
    setting.set(value);
    menu.dirty();
    alert();
  }
});
