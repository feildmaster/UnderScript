import * as menu from '../../utils/menu.js';

menu.addButton({
  text: 'Game Patch Notes',
  action() {
    window.location = './gameUpdates.jsp';
  },
});
