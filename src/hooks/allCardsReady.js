import eventManager from '../utils/eventManager.js';
import { global } from '../utils/global.js';

eventManager.on(':loaded', () => {
  function call(cards) {
    eventManager.singleton.emit('allCardsReady', cards);
  }
  const allCards = global('allCards', {
    throws: false,
  });
  if (!allCards) {
    const cached = localStorage.getItem('allCards');
    if (!cached) return;
    const parsed = JSON.parse(cached);
    window.allCards = parsed;
    call(parsed);
  } else if (!allCards.length) {
    document.addEventListener('allCardsReady', () => call(global('allCards')));
  } else {
    call(allCards);
  }
});
