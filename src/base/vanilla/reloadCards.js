import eventManager from '../../utils/eventManager.js';
import { global } from '../../utils/global.js';
import * as menu from '../../utils/menu.js';

eventManager.on(':preload', () => {
  const fetchAllCards = global('fetchAllCards', { throws: false });
  if (!fetchAllCards) return;
  menu.addButton({
    text: 'Reload cards',
    action() {
      localStorage.removeItem('cardsVersion');
      fetchAllCards();
    },
  });
});
