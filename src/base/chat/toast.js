import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global } from '../../utils/global.js';
import { toast } from '../../utils/2.toasts.js';
import * as user from '../../utils/user.js';
import shouldIgnore from './ignore.js';
import pingRegex from '../../utils/pingRegex.js';

const setting = settings.register({
  name: 'Enable ping toasts',
  key: 'underscript.enable.pingToast',
  default: true,
  category: 'Ping Me',
  page: 'Chat',
});

// eslint-disable-next-line import/prefer-default-export
export const globalPing = settings.register({
  name: 'Only open chats',
  key: 'underscript.enable.ping.global',
  category: 'Ping Me',
  page: 'Chat',
});

settings.register({
  name: 'On',
  key: 'underscript.ping.extras',
  type: 'array',
  default: ['@underscript'],
  category: 'Ping Me',
  page: 'Chat',
});

eventManager.on('Chat:getMessage', function pingToast(data) {
  if (this.canceled || !setting.value()) return;
  if (globalPing.value() && !data.open) return;
  const msg = JSON.parse(data.chatMessage);
  if (shouldIgnore(msg, true)) return;
  if (!msg.message.toLowerCase().includes(`@${global('selfUsername').toLowerCase()}`) && !pingRegex().test(msg.message)) return;
  const avatar = !settings.value('chatAvatarsDisabled') ? `<img src="/images/avatars/${msg.user.avatar.image}.${msg.user.avatar.extension || 'png'}" class="avatar ${msg.user.avatar.rarity}" height="35" style="float: left; margin-right: 7px;">` : '';
  const chatNames = global('chatNames');
  toast({
    title: `${avatar}${user.name(msg.user)} (${chatNames[data.idRoom - 1] ? $.i18n(chatNames[data.idRoom - 1]) : data.idRoom || 'UNKNOWN'})`,
    text: msg.message,
  });
});
