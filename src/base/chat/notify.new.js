settings.register({
  name: 'Disable Chat Ping <span style="color: yellow;">(highlighting)</span>',
  key: 'underscript.disable.ping',
  page: 'Chat',
});

eventManager.on('ChatDetected', () => {
  const mask = '<span style="color: yellow;">$1</span>';

  globalSet('notif', function newNotify(original) {
    if (!settings.value('underscript.disable.ping') && !pendingIgnore.get()) {
      const text = mentions(original);

      const regex = fn.pingRegex();
      if (regex.test(text)) {
        if (original === text) {
          playSound();
        }
        return text.replace(regex, mask);
      }

      return text;
    }
    return original;
  });

  function mentions(text) {
    const regex = new RegExp(`((?:^|[^a-zA-Z0-9_!#$%&*@.])@${global('selfUsername')}(?:$|[ .]))`, 'gi');
    if (regex.test(text)) {
      playSound();
      return text.replace(regex, mask);
    }
    return text;
  }

  function playSound() {
    if (global('soundsEnabled')) {
      (new Audio("sounds/highlight.wav")).play();
    }
  }
});
