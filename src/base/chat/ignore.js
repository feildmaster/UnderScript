/* eslint-disable consistent-return */
settings.register({
  name: 'Disable',
  key: 'underscript.disable.ignorechat',
  page: 'Chat',
  category: 'Ignored Users',
});

settings.register({
  name: 'Behavior',
  key: 'underscript.ignorechat.how',
  type: 'select',
  options: ['remove', 'hide'],
  page: 'Chat',
  category: 'Ignored Users',
});

// This isn't really the best name to call this function
function shouldIgnore(message, self = false) {
  // Ignoring is disabled?
  if (settings.value('underscript.disable.ignorechat')) return false;
  const user = message.user;
  const id = user.id;
  // Is it your own message?
  if (id === global('selfId')) return self;
  // Is user mod?
  if (fn.user.isMod(user)) return false;
  // Ignoring user?
  return !!settings.value(`underscript.ignore.${id}`);
}

eventManager.on('ChatDetected', function ignoreChat() {
  let container;
  let count;

  function processMessage(message, room, history = false) {
    debug(message, 'debugging.chat.message');
    if (!shouldIgnore(message) || global('isFriend')(message.user.id)) {
      container = null;
      return;
    }

    const msg = $(`#${room} #message-${message.id}`);
    const type = settings.value('underscript.ignorechat.how');
    if (type === 'hide') {
      if (!history) {
        pendingIgnore.set(true);
        return;
      }
      msg.find(`.chat-message`).html('<span class="gray">Message Ignored</span>')
        .removeClass().addClass('chat-message');
    } else if (type === 'remove') {
      debug(`removed ${fn.user.name(message.user)}`, 'debugging.chat');
      if (!container) {
        count = 1;
        container = $('<li class="ignored-chat">');
        if (history) {
          msg.after(container);
          msg.remove();
        } else {
          const messages = $(`#${room} .chat-messages`);
          const force = messages.scrollTop() + 100 > messages.prop('scrollHeight') - messages.height();
          messages.append(container);
          global('scroll')(room, force);
        }
      } else if (history) {
        msg.remove();
      }
      container.text(`${count} Message${count > 1 ? 's' : ''} Ignored`);
      count += 1;
      return true;
    } else if (type === 'none') {
      if (history) msg.remove();
      else return true;
    }
  }

  eventManager.on('Chat:getHistory', (data) => {
    JSON.parse(data.history).forEach((message) => {
      processMessage(message, data.room, true);
    });
  });

  eventManager.on('preChat:getMessage', function preProcess(data) {
    if (this.canceled) return;
    this.canceled = processMessage(JSON.parse(data.chatMessage), data.room);
  });

  eventManager.on('Chat:getMessage', function hideMessage(data) {
    if (settings.value('underscript.ignorechat.how') !== 'hide') return;
    const message = JSON.parse(data.chatMessage);
    if (!shouldIgnore(message) || global('isFriend')(message.user.id)) return;
    $(`#${data.room} #message-${message.id} .chat-message`).html('<span class="gray">Message Ignored</span>')
      .removeClass().addClass('chat-message');
  });
});
