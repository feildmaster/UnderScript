import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { toast } from 'src/utils/2.toasts.js';
import * as user from 'src/utils/user.js';
import pingRegex from 'src/utils/pingRegex.js';
import Translation from 'src/structures/constants/translation.js';

import shouldIgnore from './ignore.js';

const category = Translation.Setting('category.chat.ping');

const setting = settings.register({
  name: Translation.Setting('ping.toast'),
  key: 'underscript.enable.pingToast',
  default: true,
  category,
  page: 'Chat',
});

export const globalPing = settings.register({
  name: Translation.Setting('ping.toast'),
  key: 'underscript.enable.ping.global',
  category,
  page: 'Chat',
});

export const pingExtras = settings.register({
  name: Translation.Setting('ping.on'),
  key: 'underscript.ping.extras',
  type: 'array',
  default: ['@underscript'],
  category,
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
