import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global } from '../../utils/global.js';
import { toast } from '../../utils/2.toasts.js';
import isFriend from '../../utils/isFriend.js';
import { self, name } from '../../utils/user.js';

const setting = settings.register({
  name: 'Announcement',
  key: 'underscript.announcement.legend',
  options: ['Chat', 'Toast', 'Both', 'Hidden'],
  default: 'Toast',
  type: 'select',
  page: 'Chat',
  category: 'Legendary User',
});

const ignoreSelf = settings.register({
  name: 'Ignore Self',
  key: 'underscript.announcement.legend.notSelf',
  page: 'Chat',
  category: 'Legendary User',
  default: true,
});

const friends = settings.register({
  name: 'Friends Only',
  key: 'underscript.announcement.legend.friendsOnly',
  page: 'Chat',
  category: 'Legendary User',
});

// test method: plugin.events.emit.cancelable('preChat:getMessageAuto', { message: JSON.stringify({ args: JSON.stringify(['chat-new-legend', 'user']) }) })
const events = ['chat-new-legend'];
eventManager.on('preChat:getMessageAuto', function legend(data) {
  const [type, user] = JSON.parse(JSON.parse(data.message).args);
  if (this.canceled || !events.includes(type)) return;
  if (ignoreSelf.value() && name(self()) === user) {
    this.canceled = true;
    return;
  }
  const handling = setting.value();
  const friendsOnly = friends.value();
  if (handling === 'Chat' && !friendsOnly) return; // All default
  const hidden = handling === 'Hidden';
  this.canceled = hidden || handling === 'Toast';
  if (hidden) return;
  if (friendsOnly && !isFriend(user)) {
    this.canceled = true;
    return;
  }
  toast({
    text: global('translateFromServerJson')(data.message),
    css: {
      color: 'yellow',
      footer: { color: 'white' },
    },
  });
});
