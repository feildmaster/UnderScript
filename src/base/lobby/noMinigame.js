import * as settings from '../../utils/settings';
import { global, globalSet } from '../../utils/global';
import onPage from '../../utils/onPage';
import compound from '../../utils/compoundEvent';

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
