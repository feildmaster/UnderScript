import eventManager from 'src/utils/eventManager.js';
import { global, globalSet } from 'src/utils/global.js';

// TODO: Remove this when fixed
eventManager.on(':preload:Decks', () => {
  globalSet('ajaxUrl', 'DecksConfig');
});

eventManager.on('Deck:Loaded', () => {
  const params = new URLSearchParams(location.search);
  const deckCode = params.get('deckCode') || params.get('deck');
  if (!deckCode) return;

  global('loadDeckCode')(deckCode);
});
