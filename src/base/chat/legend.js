import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { toast } from 'src/utils/2.toasts.js';
import isFriend from 'src/utils/isFriend.js';
import { self, name } from 'src/utils/user.js';
import Translation from 'src/structures/constants/translation.ts';

const category = Translation.Setting('category.announce.user');

const setting = settings.register({
  name: Translation.Setting('announce'),
  key: 'underscript.announcement.legend',
  options: ['Chat', 'Toast', 'Both', 'Hidden'],
  default: 'Toast',
  type: 'select',
  page: 'Chat',
  category,
});

const ignoreSelf = settings.register({
  name: Translation.Setting('announce.notSelf'),
  key: 'underscript.announcement.legend.notSelf',
  page: 'Chat',
  category,
  default: true,
});

const friends = settings.register({
  name: Translation.Setting('announce.friendsOnly'),
  key: 'underscript.announcement.legend.friendsOnly',
  page: 'Chat',
  category,
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
