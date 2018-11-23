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

// This isn't really the best name to call this function
function shouldIgnore(message, self = false) {
  // Ignoring is disabled?
  if (settings.value('underscript.disable.ignorechat')) return false;
  const user = message.user;
  const id = user.id;
  // Is it your own message?
  if (id === selfId) return self;
  // Is user staff?
  if (user.mainGroup.priority <= 6) return false;
  // Ignoring user?
  return !!settings.value(`underscript.ignore.${id}`);
}

function processMessage(message, room, history = false) {
  debug(message, 'debugging.chat.message');
  if (!shouldIgnore(message)) return;

  const msg = $(`#${room} #message-${message.id}`);
  const type = settings.value('underscript.ignorechat.how');
  if (type === 'hide') {
    if (!history) {
      pendingIgnore.set(true);
      return;
    }
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
    processMessage(message, data.room, true);
  });
});

eventManager.on('preChat:getMessage', function (data) {
  if (this.canceled) return;
  this.canceled = processMessage(JSON.parse(data.chatMessage), data.room);
});

eventManager.on('Chat:getMessage', function hideMessage(data) {
  const message = JSON.parse(data.chatMessage);
  if (!shouldIgnore(message)) return;
  if (settings.value('underscript.ignorechat.how') !== 'hide') return;
  $(`#${data.room} #message-${message.id} .chat-message`).html('<span class="gray">Message Ignored</span>').removeClass().addClass('chat-message');
});
