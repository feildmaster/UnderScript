import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { toast as basicToast } from 'src/utils/2.toasts.js';
import { globalSet } from 'src/utils/global.js';
import Translation from 'src/structures/constants/translation.js';

const setting = settings.register({
  name: Translation.Setting('disable.resultToast'),
  key: 'underscript.disable.resultToast',
  page: 'Game',
  category: Translation.CATEGORY_NOTIFICATIONS,
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
    className: 'underscript-toast-result',
    onClose: () => {
      document.location.href = '/';
    },
  };
  basicToast(toast);
});
