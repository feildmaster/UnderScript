import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global } from '../../utils/global.js';
import * as user from '../../utils/user.js';

const setting = settings.register({
  name: 'Autocomplete: Online Friends Only',
  key: 'underscript.autocomplete.friends.online',
  page: 'Chat',
});

eventManager.on('@autocomplete', ({ list }) => {
  list.splice(0, 0, ...global('selfFriends')
    .filter(({ online }) => !setting.value() || online)
    .map(user.name)
    .filter((name) => !list.includes(name)));
});
