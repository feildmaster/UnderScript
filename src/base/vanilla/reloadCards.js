import eventManager from '../../utils/eventManager';
import { global } from '../../utils/global';
import * as menu from '../../utils/menu';

eventManager.on(':loaded', () => {
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
