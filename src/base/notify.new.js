settings.register({
  name: 'Disable Chat Ping <span style="color: yellow;">(highlighting)</span>',
  key: 'underscript.disable.ping',
  page: 'Chat',
});

settings.register({
  name: 'Use Original Chat Ping Detection',
  key: 'underscript.disable.notify',
  page: 'Chat',
});

eventManager.on('ChatDetected', () => {
  const mask = '<span style="color: yellow;">$1</span>';

  const oNotify = notif;
  notif = (text) => {
    if (!settings.value('underscript.disable.ping')) {
      if (settings.value('underscript.disable.notify')) {
        return oNotify(text);
      }
      const regex = fn.pingRegex();
      if (regex.test(text)) {
        if (soundsEnabled) {
          (new Audio("sounds/highlight.wav")).play();
        }
        return text.replace(regex, mask);
      }
    }
    return text;
  };
});