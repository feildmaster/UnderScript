import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { toast } from 'src/utils/2.toasts.js';
import { debug } from 'src/utils/debug.js';
import each from 'src/utils/each.js';
import { buttonCSS as css } from 'src/utils/1.variables.js';
import { isMod, name as username } from 'src/utils/user';
import streaming from './0.streamer.js';

// Toast for private messages while streaming mode is on
// TODO: translation
const busyMessage = ':me:is in do not disturb mode'; // TODO: configurable?
const allow = 'Allow';
const hide = 'Hide';
const silent = 'Hide (silent)';
const setting = settings.register({
  name: 'Private Messages',
  key: 'underscript.streamer.pms',
  options: [allow, hide, silent],
  default: hide,
  category: 'Streamer Mode',
});

const toasts = {};

eventManager.on('preChat:getPrivateMessage', function streamerMode(data) {
  if (!streaming() || data.open) return; // if not streaming, if window is already open

  const val = setting.value();
  if (val === allow) return; // if private messages are allowed
  debug(data);

  const message = JSON.parse(data.chatMessage);
  const user = message.user;

  if (isMod(user)) return; // Moderators are always allowed

  this.canceled = true; // Cancel the event from going through

  const userId = user.id;
  const privateChats = global('privateChats');
  const history = privateChats[userId] || [];
  history.push(message);

  if (userId === global('selfId')) return; // ignore automated reply

  global('sendPrivateMessage')(busyMessage, `${userId}`); // send a message that you're busy

  if (val === silent || toasts[userId]) return; // Don't announce anymore
  toasts[userId] = toast({
    text: `Message from ${username(user)}`,
    buttons: [{
      css,
      text: 'Open',
      className: 'dismiss',
      onclick: () => {
        open(user);
      },
    }],
    className: 'dismissable',
  });
});
eventManager.on(':unload', closeAll);

function open(user) {
  const { id } = user;
  global('openPrivateRoom')(id, username(user).replace('\'', ''));
  delete toasts[id];
}

function closeAll() {
  each(toasts, (t) => t.close());
}
