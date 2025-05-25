import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { errorToast } from 'src/utils/2.toasts.js';

const setting = settings.register({
  name: 'Disable Error Toast',
  key: 'underscript.disable.errorToast',
  page: 'Game',
  category: 'Notifications',
});

eventManager.on('getError:before getGameError:before', function toast(data) {
  if (setting.value() || this.canceled) return;
  this.canceled = true;
  errorToast({
    title: $.i18n('dialog-error'),
    text: global('translateFromServerJson')(data.message),
    onClose() {
      document.location.href = 'Play';
    },
  });
});
