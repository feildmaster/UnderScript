import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global } from '../../utils/global.js';
import { toast as SimpleToast } from '../../utils/2.toasts.js';
import { self, name } from '../../utils/user.js';

const setting = settings.register({
  name: 'Announcement',
  key: 'underscript.announcement.draws',
  type: 'select',
  options: ['chat', 'toast', 'both', 'hidden'],
  default: 'toast',
  page: 'Chat',
  category: 'Legendary Card',
});

const ignoreSelf = settings.register({
  name: 'Ignore Self',
  key: 'underscript.announcement.draws.notSelf',
  page: 'Chat',
  category: 'Legendary Card',
  default: true,
});

const toasts = [];
let toastIndex = 0;
function getToast(user) {
  const now = Date.now();
  return toasts.find(({ exists, owner, time }) => exists() && owner === user && time + 1000 > now);
}

// test method: plugin.events.emit.cancelable('preChat:getMessageAuto', { message: JSON.stringify({ args: JSON.stringify(['chat-legendary-notification', 'user', 'card']) }) })
const events = ['chat-legendary-notification', 'chat-legendary-shiny-notification'];
eventManager.on('preChat:getMessageAuto', function drawAnnouncement(data) {
  const [event, user, card] = JSON.parse(JSON.parse(data.message).args);
  if (this.canceled || !events.includes(event)) return;
  if (ignoreSelf.value() && name(self()) === user) {
    this.canceled = true;
    return;
  }
  const type = setting.value();
  if (type === 'chat') return;
  const both = type === 'both';
  this.canceled = !both;
  if (both || type === 'toast') {
    const translateFromServerJson = global('translateFromServerJson');
    const last = getToast(user);
    if (last) {
      last.cards.unshift(card);
      const newText = last.cards.join(', ');
      last.setText(translateFromServerJson(JSON.stringify({ args: JSON.stringify([event, user, newText]) })));
      last.time = Date.now(); // This toast is still relevant!
      return;
    }
    if (toasts[toastIndex]) { // Close any old toast
      toasts[toastIndex].close();
    }

    const toast = SimpleToast({
      text: translateFromServerJson(data.message),
      css: {
        color: 'yellow',
        footer: {
          color: 'white',
        },
      },
    });
    toast.cards = [card];
    toast.owner = user;
    toast.time = Date.now();
    toasts[toastIndex] = toast;
    toastIndex = (toastIndex + 1) % 3;
  }
});
