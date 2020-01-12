settings.register({
  name: 'Disable Chat Ping <span style="color: yellow;">(highlighting)</span>',
  key: 'underscript.disable.ping',
  page: 'Chat',
});

eventManager.on('ChatDetected', () => {
  const mask = '<span style="color: yellow;">$1</span>';

  globalSet('notif', function newNotify(original) {
    if (!settings.value('underscript.disable.ping') && !pendingIgnore.get()) { // TODO
      const text = this.super(original);

      const regex = fn.pingRegex();
      if (regex.test(text)) {
        if (global('soundsEnabled') && original === text) {
          (new Audio('sounds/highlight.wav')).play();
        }
        return regex.replace(text, mask);
      }

      return text;
    }
    return original;
  });
});
