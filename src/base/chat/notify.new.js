import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global, globalSet } from 'src/utils/global.js';
import pendingIgnore from 'src/utils/pendingIgnore.js';
import pingRegex from 'src/utils/pingRegex.js';
import { infoToast } from 'src/utils/2.toasts.js';
import { buttonCSS } from 'src/utils/1.variables.js';
import Translation from 'src/structures/constants/translation.js';
import style from 'src/utils/style.js';

import { pingExtras } from './toast.js';

style.add('.highlight { color: yellow; }');

const setting = settings.register({
  name: Translation.Setting('ping'),
  key: 'underscript.disable.ping',
  page: 'Chat',
});

const mask = '<span class="highlight">$1</span>';

let disabled = false;
let notified = false;

eventManager.on('preChat:getHistory Chat:getHistory', function enable(data) {
  if (disabled || global('soundsEnabled')) {
    if (disabled !== 'history') {
      globalSet('soundsEnabled', this.event === 'Chat:getHistory');
    }
    disabled = !disabled;
  } else {
    disabled = 'history';
  }
});

eventManager.on('ChatDetected', () => {
  globalSet('notif', function newNotify(original) {
    if (!setting.value() && !pendingIgnore.get()) { // TODO
      const text = this.super(original);

      const regex = pingRegex();
      if (regex.test(text)) {
        if (global('soundsEnabled') && original === text) {
          (new Audio('sounds/highlight.wav')).play();
        }
        notify();
        return regex.replace(text, mask);
      }

      return text;
    }
    return original;
  });
});

function notify() {
  if (disabled || notified) return;
  notified = true;
  if (!pingExtras.value().includes('@underscript')) return;
  infoToast({
    text: Translation.Toast('ping'),
    buttons: [{
      text: Translation.Toast('ping.settings'),
      className: 'dismiss',
      onclick() {
        pingExtras.show(true);
      },
    }, {
      text: Translation.Toast('ping.remove'),
      className: 'dismiss',
      onclick() {
        const words = pingExtras.value();
        pingExtras.set(words.filter((word) => word !== '@underscript'));
      },
    }, {
      text: Translation.DISMISS,
      className: 'dismiss',
    }],
    className: 'dismissable',
    css: {
      button: {
        ...buttonCSS,
        'white-space': 'normal',
      },
    },
  }, 'underscript.alert.ping');
}
