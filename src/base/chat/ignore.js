/* eslint-disable consistent-return */
import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global } from '../../utils/global.js';
import * as fnUser from '../../utils/user.js';
import pendingIgnore from '../../utils/pendingIgnore.js';
import { debug } from '../../utils/debug.js';

const setting = settings.register({
  name: 'Disable',
  key: 'underscript.disable.ignorechat',
  page: 'Chat',
  category: 'Ignored Users',
});

const how = settings.register({
  name: 'Behavior',
  key: 'underscript.ignorechat.how',
  type: 'select',
  options: ['remove', 'hide', 'none'],
  page: 'Chat',
  category: 'Ignored Users',
});

// This isn't really the best name to call this function
export default function shouldIgnore(message, self = false) {
  // Ignoring is disabled?
  if (setting.value()) return false;
  const user = message.user;
  const id = user.id;
  // Is it your own message?
  if (id === global('selfId')) return self;
  // Is user mod?
  if (fnUser.isMod(user)) return false;
  // Ignoring user?
  return !!settings.value(`underscript.ignore.${id}`);
}

let count;

function processMessage(message, room, history = false) {
  debug(message, 'debugging.chat.message');
  if (!shouldIgnore(message) || global('isFriend')(message.user.id)) {
    $(`#${room}`).removeData('container');
    return;
  }

  const msg = $(`#${room} #message-${message.id}`);
  const type = how.value();
  if (type === 'hide') {
    if (!history) {
      pendingIgnore.set(true);
      return;
    }
    msg.find(`.chat-message`).html('<span class="gray">Message Ignored</span>')
      .removeClass().addClass('chat-message');
  } else if (type === 'remove') {
    debug(`removed ${fnUser.name(message.user)}`, 'debugging.chat');
    let container = $(`#${room}`).data('container');
    if (!container) {
      count = 1;
      container = $('<li class="ignored-chat">');
      if (history) {
        msg.after(container);
        msg.remove();
      } else {
        const messages = $(`#${room} .chat-messages`);
        messages.append(container);
        global('scroll')($(`#${room}`), true);
      }
      $(`#${room}`).data('container', container);
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
  if (how.value() !== 'hide') return;
  const message = JSON.parse(data.chatMessage);
  if (!shouldIgnore(message) || global('isFriend')(message.user.id)) return;
  $(`#${data.room} #message-${message.id} .chat-message`).html('<span class="gray">Message Ignored</span>')
    .removeClass().addClass('chat-message');
});
