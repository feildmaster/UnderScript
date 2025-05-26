import Translation from 'src/structures/constants/translation.js';
import * as settings from './settings/index.js';

export default function ignoreUser(name, key, set = false) {
  const setting = settings.register({
    key,
    name,
    type: 'remove',
    page: 'Chat',
    category: Translation.CATEGORY_CHAT_IGNORED,
  });
  if (set) {
    setting.set(name);
  }
}
