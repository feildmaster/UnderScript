settings.register({
  name: 'Disable Broadcast Toast',
  key: 'underscript.disable.broadcast',
  page: 'Chat',
});

eventManager.on('Chat:getMessageBroadcast', function broadcast({message}) {
  if (settings.value('underscript.disable.broadcast')) return;
  fn.infoToast({
    title: '[INFO] Undercards Broadcast Message',
    text: `<span style="color: #ff00ff;">${message}</span>`,
    footer: 'info-chan via UnderScript',
  });
});
