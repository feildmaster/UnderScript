import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { globalSet } from 'src/utils/global.js';
import onPage from 'src/utils/onPage.js';
import Translation from 'src/structures/constants/translation';

const setting = settings.register({
  name: Translation.Setting('deck.preview'),
  key: 'underscript.disable.deckPreview',
  // hidden: typeof displayCardDeck === 'function',
  onChange(val, val2) {
    if (!onPage('Decks') || typeof cardHoverEnabled === 'undefined') return;
    globalSet('cardHoverEnabled', !val);
  },
  page: 'Library',
});

eventManager.on(':preload:Decks', function previewLoaded() {
  if (typeof displayCardDeck === 'function') {
    globalSet('cardHoverEnabled', !setting.value());
  }
});
