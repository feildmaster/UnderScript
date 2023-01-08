import * as settings from './settings/index.js';

export default function ignoreUser(name, key, set = false) {
  const setting = settings.register({
    key,
    name,
    type: 'remove',
    page: 'Chat',
    category: 'Ignored Users',
  });
  if (set) {
    setting.set(name);
  }
}
