import Translation from 'src/structures/constants/translation.ts';
import eventManager from 'src/utils/eventManager.js';
import { global } from 'src/utils/global.js';
import * as menu from 'src/utils/menu.js';

eventManager.on(':preload', () => {
  const fetchAllCards = global('fetchAllCards', { throws: false });
  if (!fetchAllCards) return;
  menu.addButton({
    text: Translation.Menu('reload'),
    action() {
      localStorage.removeItem('cardsVersion');
      fetchAllCards();
    },
  });
});
