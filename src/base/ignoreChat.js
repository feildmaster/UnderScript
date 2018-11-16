settings.register({
  name: 'Disable Ignore Chat',
  key: 'underscript.disable.ignorechat',
  page: 'Chat',
});

settings.register({
  name: 'Ignore Behavior',
  key: 'underscript.ignorechat.how',
  type: 'select',
  options: ['remove', 'hide'],
  page: 'Chat',
});

function processMessage(message, room) {
  debug(message, 'debugging.chat.message')
  // Ignoring is disabled?
  if (settings.value('underscript.disable.ignorechat')) return;
  const user = message.user;
  const id = user.id;
  // Is it your own message?
  if (id === selfId) return;
  // Is user staff?
  if (user.mainGroup.priority <= 6) return;
  // Not ignoring?
  if (!settings.value(`underscript.ignore.${id}`)) return; 

  const msg = $(`#${room} #message-${message.id}`);
  const type = settings.value('underscript.ignorechat.how');
  if (type === 'hide') {
    msg.find(`.chat-message`).html('<span class="gray">Message Ignored</span>').removeClass().addClass('chat-message');
  } else if (type === 'remove') {
    debug('removed', 'debugging.chat');
    msg.remove();
    return true;
  } else if (type === 'bulk') {
    debug('bulk', 'debugging.chat');
    // TODO "bulk" removal ("X Ignored Message")
    msg.remove();
    return true;
  }
}

eventManager.on('Chat:getHistory', (data) => {
  JSON.parse(data.history).forEach((message) => {
    processMessage(message, data.room);
  });
});

eventManager.on('Chat:getMessage', function (data) {
  this.canceled = processMessage(JSON.parse(data.chatMessage), data.room);
});
