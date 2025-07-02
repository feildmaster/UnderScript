import { hotkeys } from 'src/utils/1.variables.js';
import Hotkey from 'src/utils/hotkey.class.js';
import length from 'src/utils/length.js';
import * as menu from 'src/utils/menu.js';

hotkeys.push(new Hotkey('Open Menu', () => {
  if (typeof BootstrapDialog !== 'undefined' && length(BootstrapDialog.dialogs)) {
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
