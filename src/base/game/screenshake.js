import * as settings from '../../utils/settings';
import { globalSet } from '../../utils/global';
import onPage from '../../utils/onPage';
import compound from '../../utils/compoundEvent';

const setting = settings.register({
  name: 'Disable Screen Shake',
  key: 'underscript.disable.rumble',
  options: ['Never', 'Always', 'Spectate'],
  type: 'select',
  page: 'Game',
});

compound('GameStart', ':loaded', function rumble() {
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
