import { hotkeys } from '../../utils/1.variables.js';
import Hotkey from '../../utils/hotkey.class.js';
import * as menu from '../../utils/menu.js';

hotkeys.push(new Hotkey('Open Menu', () => {
  if (typeof BootstrapDialog !== 'undefined' && Object.keys(BootstrapDialog.dialogs).length) {
    return;
  }
  if (menu.isOpen()) {
    menu.close();
  } else {
    menu.open();
  }
}, {
  keys: ['Escape'],
}));
