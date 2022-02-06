import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global } from '../../utils/global';
import { toast as SimpleToast } from '../../utils/2.toasts';

settings.register({
  name: 'Announcement',
  key: 'underscript.announcement.draws',
  type: 'select',
  options: ['chat', 'toast', 'both', 'hidden'],
  default: 'toast',
  page: 'Chat',
  category: 'Legendary Card',
});

const toasts = [];
let toastIndex = 0;
function getToast(owner) {
  const now = Date.now();
  for (let i = 0; i < toasts.length; i++) {
    const toast = toasts[i];
    if (toast && toast.exists() && owner === toast.owner && toast.time + 1000 > now) {
      return toast;
    }
  }
  return null;
}

const events = ['chat-legendary-notification', 'chat-legendary-shiny-notification'];
eventManager.on('preChat:getMessageAuto', function drawAnnouncement(data) {
  const message = JSON.parse(JSON.parse(data.message).args);
  if (this.canceled || !events.includes(message[0])) return;
  const setting = settings.value('underscript.announcement.draws');
  if (setting === 'chat') return;
  const both = setting === 'both';
  this.canceled = !both;
  if (both || setting === 'toast') {
    const owner = message[1];
    const card = message[2];

    const translateFromServerJson = global('translateFromServerJson');
    const last = getToast(owner);
    if (last) {
      last.cards.unshift(card);
      message[2] = last.cards.join(', ');
      last.setText(translateFromServerJson(JSON.stringify({ args: JSON.stringify(message) })));
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
    toast.owner = owner;
    toast.time = Date.now();
    toasts[toastIndex] = toast;
    toastIndex = (toastIndex + 1) % 3;
  }
});
