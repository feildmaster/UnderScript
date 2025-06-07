import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import * as api from 'src/utils/4.api.js';
import { toast } from 'src/utils/2.toasts.js';
import * as menu from 'src/utils/menu.js';
import Translation from 'src/structures/constants/translation';

const silent = 'Yes (silent)';
const disabled = 'No';
const data = [
  [Translation.Setting('streamer.option.1'), 'Yes'],
  [Translation.Setting('streamer.option.2'), silent],
  [Translation.Setting('streamer.option.3'), disabled],
];
const mode = settings.register({
  name: Translation.Setting('streamer'),
  key: 'underscript.streamer',
  note: Translation.Setting('streamer.note'),
  data,
  default: disabled,
  onChange: (val) => {
    if (val === disabled) {
      update(false);
    } else {
      menu.dirty();
    }
  },
  type: 'select',
  category: Translation.CATEGORY_STREAMER,
});
const setting = settings.register({
  key: 'underscript.streaming',
  hidden: true,
});
api.register('streamerMode', streaming);
const ON = Translation.Menu('streamer.on');
const OFF = Translation.Menu('streamer.off');
menu.addButton({
  text: () => (streaming() ? ON : OFF),
  hidden: () => mode.value() === disabled,
  action: () => update(!streaming()),
});
eventManager.on(':preload', alert);

function alert() {
  if (!streaming() || mode.value() === silent) return;
  toast(Translation.Toast('streamer'));
}

function update(value) {
  setting.set(value);
  menu.dirty();
  alert();
}

export default function streaming() {
  return setting.value();
}
