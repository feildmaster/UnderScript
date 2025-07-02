import * as settings from 'src/utils/settings/index.js';
import { global, globalSet } from 'src/utils/global.js';
import onPage from 'src/utils/onPage.js';
import compound from 'src/utils/compoundEvent.js';
import Translation from 'src/structures/constants/translation.ts';

// TODO: translation
const setting = settings.register({
  name: Translation.Setting('minigame'),
  key: 'underscript.minigames.disabled',
  page: 'Lobby',
  refresh: onPage('Play'),
  category: Translation.CATEGORY_MINIGAMES,
});

compound(':preload:Play', 'pre:getJoinedQueue', () => {
  if (setting.value() && global('miniGameLoaded')) globalSet('miniGameLoaded', false);
});
