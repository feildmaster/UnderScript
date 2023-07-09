import eventManager from '../../../utils/eventManager.js';
import { global, globalSet } from '../../../utils/global.js';

// TODO: Remove this when fixed
eventManager.on(':loaded:Decks', () => {
  globalSet('ajaxUrl', 'DecksConfig');
});

eventManager.on('Deck:Loaded', () => {
  const params = new URLSearchParams(location.search);
  const deckCode = params.get('deckCode') || params.get('deck');
  if (!deckCode) return;

  global('loadDeckCode')(deckCode);
});
