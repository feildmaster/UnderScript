settings.register({
  name: 'Disable Deck Preview',
  key: 'underscript.disable.deckPreview',
  //hidden: typeof displayCardDeck === 'function',
  onChange(val, val2) {
    if (!onPage('Decks') || typeof cardHoverEnabled === 'undefined') return;
    cardHoverEnabled = val === '0';
  },
  page: 'Library',
});

// TODO: Convert to event listeners?
onPage('Decks', function () {
  function getCard(id, shiny) {
    const el = decks[classe].find(card => card.id === id && card.shiny === shiny);
    if (el) {
      c = $('<div>');
      appendCard(c, el); // external
      return c;
    }
  }

  function hoverCard(element) {
    const id = element.attr('id');
    const shiny = element.hasClass('shiny');
    const card = getCard(parseInt(id), shiny);
    if (!card) return hover.show('Unknown card');
    return hover.show(card);
  }
  
  function checkHover(el) {
    const hover = hoverCard(el);
    return (e) => {
      if (!settings.value('underscript.disable.deckPreview')) {
        hover(e);
      }
    };
  }

  eventManager.on(':loaded', () => {
    if (typeof displayCardDeck === 'function') {
      cardHoverEnabled = !settings.value('underscript.disable.deckPreview');
      return;
    }
    const oRefresh = refreshDeckList;
    refreshDeckList = function newRefresh() {
      oRefresh();
      $('#deckCards li').each(function (index) {
        const element = $(this);
        element.hover(checkHover(element));
      });
    };
  });
});
