import { hotkeys } from '../../utils/1.variables';
import Hotkey from '../../utils/hotkey.class';
import * as menu from '../../utils/menu';

hotkeys.push(new Hotkey('Open Menu')
  .run((e) => {
    if (typeof BootstrapDialog !== 'undefined' && Object.keys(BootstrapDialog.dialogs).length) {
      return;
    }
    if (menu.isOpen()) {
      menu.close();
    } else {
      menu.open();
    }
  })
  .bindKey(27));
