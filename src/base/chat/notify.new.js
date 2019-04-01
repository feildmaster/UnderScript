settings.register({
  name: 'Disable Chat Ping <span style="color: yellow;">(highlighting)</span>',
  key: 'underscript.disable.ping',
  page: 'Chat',
});

eventManager.on('ChatDetected', () => {
  const mask = '<span style="color: yellow;">$1</span>';

  const oNotify = globalSet('notif', (original) => {
    if (!settings.value('underscript.disable.ping') && !pendingIgnore.get()) {
      const text = oNotify(original);

      const regex = fn.pingRegex();
      if (regex.test(text)) {
        if (global('soundsEnabled') && original === text) {
          (new Audio("sounds/highlight.wav")).play();
        }
        return text.replace(regex, mask);
      }

      return text;
    }
    return original;
  });
});
