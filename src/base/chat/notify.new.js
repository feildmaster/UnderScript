import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global, globalSet } from '../../utils/global.js';
import pendingIgnore from '../../utils/pendingIgnore.js';
import pingRegex from '../../utils/pingRegex.js';

const setting = settings.register({
  name: 'Disable Chat Ping <span style="color: yellow;">(highlighting)</span>',
  key: 'underscript.disable.ping',
  page: 'Chat',
});

const mask = '<span style="color: yellow;">$1</span>';

let disabled = false;

eventManager.on('preChat:getHistory Chat:getHistory', function enable(data) {
  if (disabled || global('soundsEnabled')) {
    globalSet('soundsEnabled', this.event === 'Chat:getHistory');
    disabled = !disabled;
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
        return regex.replace(text, mask);
      }

      return text;
    }
    return original;
  });
});
