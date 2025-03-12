import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global, globalSet } from '../../utils/global.js';

const setting = settings.register({
  name: 'Disable April Fools Jokes',
  key: 'underscript.disable.fishday',
  note: 'Disables *almost* everything.',
  hidden: () => global('fish', { throws: false }) === undefined,
  refresh: true,
});
if (setting.value()) {
  eventManager.on(':preload', () => globalSet('fish', false, { throws: false }));
}
