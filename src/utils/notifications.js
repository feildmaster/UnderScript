import * as settings from './settings';
import sleep from './sleep';
import eventManager from './eventManager';
import { toast } from './2.toasts';

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
  eventManager.on(':load:Play', () => show('UnderScript would like to notify you when a game is found.'));
}

function show(text = 'UnderScript would like to send notifications.') {
  const css = {
    border: '',
    height: '',
    background: '',
    'font-size': '',
    margin: '',
    'border-radius': '',
  };
  const buttons = [{
    css,
    text: 'Request Permission',
    className: 'dismiss',
    onclick() {
      requestPermission().then((result) => {
        toast(`Notifications ${result === 'granted' ? 'allowed' : 'denied'}`);
      });
    },
  }, {
    css,
    text: 'Dismiss',
    className: 'dismiss',
    onclick() {
      setting.set(true);
    },
  }];
  toast({
    buttons,
    text,
    className: 'dismissable',
  });
}
