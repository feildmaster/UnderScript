import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { toast as basicToast } from '../../utils/2.toasts.js';
import { globalSet } from '../../utils/global.js';

const setting = settings.register({
  name: 'Disable Result Toast',
  key: 'underscript.disable.resultToast',
  page: 'Game',
});

eventManager.on('getResult:before', function resultToast() {
  if (setting.value()) return;
  // We need to mark the game as finished (like the source does)
  globalSet('finish', true);
  this.canceled = true;
  const toast = {
    title: 'Game Finished',
    text: 'Return Home',
    buttons: {
      className: 'skiptranslate',
      text: '🏠',
    },
    css: {
      'font-family': 'inherit',
      button: { background: 'rgb(0, 0, 20)' },
    },
    onClose: () => {
      document.location.href = '/';
    },
  };
  basicToast(toast);
});
