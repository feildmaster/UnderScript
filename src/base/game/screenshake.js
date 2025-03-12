import * as settings from '../../utils/settings/index.js';
import { globalSet } from '../../utils/global.js';
import onPage from '../../utils/onPage.js';
import compound from '../../utils/compoundEvent.js';

const setting = settings.register({
  name: 'Disable Screen Shake',
  key: 'underscript.disable.rumble',
  options: ['Never', 'Always', 'Spectate'],
  type: 'select',
  page: 'Game',
});

compound('GameStart', ':preload', function rumble() {
  const spectating = onPage('Spectate');
  globalSet('shakeScreen', function shakeScreen(...args) {
    if (!disabled()) this.super(...args);
  });

  function disabled() {
    switch (setting.value()) {
      case 'Spectate': return spectating;
      case 'Always': return true;
      default: return false;
    }
  }
});
