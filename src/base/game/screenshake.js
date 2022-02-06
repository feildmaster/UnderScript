import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { globalSet } from '../../utils/global';
import onPage from '../../utils/onPage';

const setting = settings.register({
  name: 'Disable Screen Shake',
  key: 'underscript.disable.rumble',
  options: ['Never', 'Always', 'Spectate'],
  type: 'select',
  page: 'Game',
});

eventManager.on('GameStart', function rumble() {
  eventManager.on(':loaded', () => {
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
});
