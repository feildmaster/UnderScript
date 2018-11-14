settings.register({
  name: 'Disable ping toasts',
  key: 'underscript.disable.pingToast',
  default: true,
  category: 'chat',
});

settings.register({
  key: 'underscript.ping.extras',
  type: 'array',
  category: 'chat',
});

(() => {
  function shouldPing(message) {
    return [selfUsername].concat(settings.value('underscript.ping.extras')).some((search) => !!~message.indexOf(search));
  }
  eventManager.on('Chat:getMessage', function pingToast(data) {
    if (this.canceled || settings.value('underscript.disable.pingToast')) return;
    const msg = JSON.parse(data.chatMessage);
    if (msg.user.id === selfId) return;
    if (!shouldPing(msg.message.toLowerCase())) return;
    fn.toast({
      text: fn.decode(`${msg.user.username}: ${msg.message}`),
      css: {
        'font-family': 'monospace',
      },
    });
  });
})();
