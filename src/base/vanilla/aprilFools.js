import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { globalSet } from '../../utils/global';

const setting = settings.register({
  name: 'Disable April Fools Jokes',
  key: 'underscript.disable.fishday',
  note: 'Disables *almost* everything.',
  refresh: true,
});
if (setting.value()) {
  eventManager.on(':loaded', () => globalSet('fish', false, { throws: false }));
}
