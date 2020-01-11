wrap(() => {
  const setting = settings.register({
    name: 'Enable ping toasts',
    key: 'underscript.enable.pingToast',
    default: true,
    category: 'Ping Me',
    page: 'Chat',
  });

  settings.register({
    name: 'On',
    key: 'underscript.ping.extras',
    type: 'array',
    default: ['@everyone'],
    category: 'Ping Me',
    page: 'Chat',
  });

  eventManager.on('Chat:getMessage', function pingToast(data) {
    if (this.canceled || !setting.value()) return;
    const msg = JSON.parse(data.chatMessage);
    if (shouldIgnore(msg, true)) return; // TODO
    if (!msg.message.toLowerCase().includes(`@${global('selfUsername').toLowerCase()}`) && !fn.pingRegex().test(msg.message)) return;
    const avatar = !settings.value('chatAvatarsDisabled') ? `<img src="/images/avatars/${msg.user.avatar.image}.${msg.user.avatar.extension}" class="avatar ${msg.user.avatar.rarity}" height="35" style="float: left; margin-right: 7px;">` : '';
    fn.toast({
      title: `${avatar}${fn.user.name(msg.user)} (${chatRoomNames[data.room]})`,
      text: msg.message,
    });
  });
});
