import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { globalSet } from '../../utils/global.js';
import onPage from '../../utils/onPage.js';

const setting = settings.register({
  name: 'Disable Deck Preview',
  key: 'underscript.disable.deckPreview',
  // hidden: typeof displayCardDeck === 'function',
  onChange(val, val2) {
    if (!onPage('Decks') || typeof cardHoverEnabled === 'undefined') return;
    globalSet('cardHoverEnabled', !val);
  },
  page: 'Library',
});

eventManager.on(':loaded:Decks', function previewLoaded() {
  if (typeof displayCardDeck === 'function') {
    globalSet('cardHoverEnabled', !setting.value());
  }
});
