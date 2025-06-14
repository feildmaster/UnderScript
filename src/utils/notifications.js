import Translation from 'src/structures/constants/translation.js';

import * as settings from './settings/index.js';
import sleep from './sleep.js';
import { toast } from './2.toasts.js';
import { buttonCSS as css, window } from './1.variables.js';
import compound from './compoundEvent.js';

const setting = settings.register({
  key: 'underscript.notification.dismissPrompt',
  hidden: true,
});

function requestPermission() {
  if (window.Notification) {
    if (isType()) {
      return Notification.requestPermission();
    }
  }
  return Promise.resolve(false);
}

function isType(type = 'default') {
  return window.Notification && Notification.permission === type;
}

export default function notify(text, title = 'Undercards') {
  const n = new Notification(title, {
    body: text,
    icon: 'images/favicon.ico',
  });

  sleep(5000).then(() => n.close());
}

if (isType() && !setting.value()) {
  compound(':load:Play', 'underscript.ready', () => show());
}

function show() {
  const buttons = [{
    css,
    text: Translation.Toast('game.request'),
    className: 'dismiss',
    onclick() {
      requestPermission().then((result) => {
        const key = result === 'granted' ? 'allowed' : 'denied';
        toast(Translation.Toast(`game.request.${key}`));
      });
    },
  }, {
    css,
    text: Translation.DISMISS,
    className: 'dismiss',
    onclick() {
      setting.set(true);
    },
  }];
  toast({
    buttons,
    text: Translation.Toast('game.request.message'),
    className: 'dismissable',
  });
}
