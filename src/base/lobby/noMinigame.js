import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { globalSet } from '../../utils/global';
import { debug } from '../../utils/debug';
import onPage from '../../utils/onPage';
import { noop } from '../../utils/1.variables';

const setting = settings.register({
  name: 'Disable',
  key: 'underscript.minigames.disabled',
  page: 'Lobby',
  refresh: onPage('Play'),
  category: 'Minigames',
});

eventManager.on(':loaded:Play', () => {
  globalSet('onload', function onload() {
    window.game = undefined; // gets overriden if minigame loads
    window.saveBest = noop; // gets overriden if minigame loads
    if (setting.value()) {
      debug('Disabling minigames');
      globalSet('mobile', true);
    }
    this.super();
    if (setting.value()) globalSet('mobile', false);
  });
});
