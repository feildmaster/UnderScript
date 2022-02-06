import * as menu from '../../utils/menu';

menu.addButton({
  text: 'Game Patch Notes',
  action() {
    window.location = './gameUpdates.jsp';
  },
});
