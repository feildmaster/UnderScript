import eventManager from '../utils/eventManager.js';
import { global } from '../utils/global.js';

eventManager.on(':loaded', () => {
  function call(cards = global('allCards')) {
    eventManager.singleton.emit('allCardsReady', cards);
  }
  const allCards = global('allCards', {
    throws: false,
  });
  if (!allCards || !allCards.length) {
    document.addEventListener('allCardsReady', call);
  } else {
    call(allCards);
  }
});
