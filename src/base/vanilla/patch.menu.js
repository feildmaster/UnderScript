import Translation from 'src/structures/constants/translation.ts';
import { window } from 'src/utils/1.variables.js';
import * as menu from 'src/utils/menu.js';

menu.addButton({
  text: Translation.Menu('gamelog'),
  action() {
    window.location = './gameUpdates.jsp';
  },
});
