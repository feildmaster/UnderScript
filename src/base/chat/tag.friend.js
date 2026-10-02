import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { infoToast } from 'src/utils/2.toasts.js';
import style from 'src/utils/style.js';
import Translation from 'src/structures/constants/translation.js';
import styles from './tag.friend.css';

const tag = settings.register({
  name: Translation.Setting('tag.friend'),
  key: 'underscript.tag.friend',
  default: true,
  page: 'Chat',
});

const color = settings.register({
  name: Translation.Setting('tag.friend.color'),
  key: 'underscript.tag.friend.color',
  type: 'color',
  default: '#b1bfbe',
  page: 'Chat',
  onChange: setColor,
  reset: true,
});

style.add(styles);
setColor(color.value());

let toast;
function processMessage(message, room) {
  if (!tag.value()) return;
  if (global('isFriend')(message.user.id)) {
    if (!toast) {
      toast = infoToast('<span class="friend">Friends</span> are now highlighted in chat.', 'underscript.notice.highlighting', '1');
    }
    $(`#${room} #message-${message.id} .chat-user`).addClass('friend');
    if (message.me) { // emotes
      $(`#${room} #message-${message.id} .chat-message`).addClass('friend');
    }
  }
}

eventManager.on('Chat:getHistory', (data) => {
  JSON.parse(data.history).forEach((message) => {
    processMessage(message, data.room);
  });
});
eventManager.on('Chat:getMessage', function tagFriends(data) {
  processMessage(JSON.parse(data.chatMessage), data.room);
});

function setColor(newColor) {
  document.documentElement.style.setProperty('--underscript-friend-color', newColor);
}
