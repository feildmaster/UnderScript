import { window } from 'src/utils/1.variables.js';
import * as menu from 'src/utils/menu.js';

menu.addButton({
  // TODO: translation
  text: 'Game Patch Notes',
  action() {
    window.location = './gameUpdates.jsp';
  },
});
