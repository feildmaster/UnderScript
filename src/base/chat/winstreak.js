import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global } from '../../utils/global';
import { toast as SimpleToast } from '../../utils/2.toasts';
import isFriend from '../../utils/isFriend';

settings.register({
  name: 'Announcement',
  key: 'underscript.winstreak',
  options: ['Chat', 'Toast', 'Both', 'Hidden'],
  default: 'Both',
  type: 'select',
  page: 'Chat',
  category: 'Winstreak',
});

settings.register({
  name: 'Friends Only',
  key: 'underscript.winstreak.friendsOnly',
  page: 'Chat',
  category: 'Winstreak',
});

const empty = { close() {} };
const toasts = {
  v: [],
  i: 0,
  add(toast) {
    (this.v[this.i] || empty).close();
    this.v[this.i] = toast;
    this.i = (this.i + 1) % 3;
    return toast;
  },
};
function friendsOnly() {
  return settings.value('underscript.winstreak.friendsOnly');
}
function checkFriend(name) {
  return !friendsOnly() || isFriend(name);
}
function checkCount(amt) {
  // return parseInt(amt, 10) >= settings.value('underscript.winstreak.count');
  return true;
}
const events = ['chat-user-ws', 'chat-user-ws-stop'];
eventManager.on('preChat:getMessageAuto', function winstreaks(data) {
  const message = JSON.parse(JSON.parse(data.message).args);
  if (this.canceled || !events.includes(message[0])) return;
  const handling = settings.value('underscript.winstreak');
  if (handling === 'Chat' && !friendsOnly()) return; // All default
  this.canceled = handling !== 'Chat' && handling !== 'Both';
  if (handling === 'Hidden') return;
  const username = message[message.length - 2];
  const streak = message[message.length - 1];
  if (!checkFriend(username) || !checkCount(streak)) {
    this.canceled = true;
    return;
  }
  // At this point Toast is guaranteed
  const toast = toasts.add(SimpleToast({
    text: global('translateFromServerJson')(data.message),
    // timeout: 10000,
    css: {
      color: 'yellow',
      footer: { color: 'white' },
    },
  }));
  toast.time = Date.now();
});
