import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global, globalSet } from '../../utils/global.js';
import pendingIgnore from '../../utils/pendingIgnore.js';
import pingRegex from '../../utils/pingRegex.js';
import { pingExtras } from './toast.js';
import { infoToast } from '../../utils/2.toasts.js';
import { buttonCSS } from '../../utils/1.variables.js';

const setting = settings.register({
  name: 'Disable Chat Ping <span style="color: yellow;">(highlighting)</span>',
  key: 'underscript.disable.ping',
  page: 'Chat',
});

const mask = '<span style="color: yellow;">$1</span>';

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
  const words = pingExtras.value();
  if (!words.includes('@underscript')) return;
  infoToast({
    text: 'UnderScript has custom notifications! You can change them however you like.',
    buttons: [{
      text: 'Open settings',
      className: 'dismiss',
      onclick() {
        pingExtras.show(true);
      },
    }, {
      text: 'Remove @underscript!',
      className: 'dismiss',
      onclick() {
        pingExtras.set(words.filter((word) => word !== '@underscript'));
      },
    }, {
      text: 'Dismiss',
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
