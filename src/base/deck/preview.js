settings.register({
  name: 'Disable Deck Preview',
  key: 'underscript.disable.deckPreview',
  // hidden: typeof displayCardDeck === 'function',
  onChange(val, val2) {
    if (!onPage('Decks') || typeof cardHoverEnabled === 'undefined') return;
    globalSet('cardHoverEnabled', !val);
  },
  page: 'Library',
});

onPage('Decks', () => {
  eventManager.on(':loaded', function previewLoaded() {
    if (typeof displayCardDeck === 'function') {
      globalSet('cardHoverEnabled', !settings.value('underscript.disable.deckPreview'));
    }
  });
});
