import * as settings from '../../utils/settings/index.js';
import { global, globalSet } from '../../utils/global.js';
import onPage from '../../utils/onPage.js';
import compound from '../../utils/compoundEvent.js';

const setting = settings.register({
  name: 'Disable',
  key: 'underscript.minigames.disabled',
  page: 'Lobby',
  refresh: onPage('Play'),
  category: 'Minigames',
});

compound(':loaded:Play', 'pre:getJoinedQueue', () => {
  if (setting.value() && global('miniGameLoaded')) globalSet('miniGameLoaded', false);
});
