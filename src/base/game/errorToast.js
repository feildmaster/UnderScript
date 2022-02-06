import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global } from '../../utils/global';
import { errorToast } from '../../utils/2.toasts';

const setting = settings.register({
  name: 'Disable Error Toast',
  key: 'underscript.disable.errorToast',
  page: 'Game',
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
