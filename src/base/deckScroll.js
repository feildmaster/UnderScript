settings.register({
  name: 'Disable Deck Scroll',
  key: 'underscript.disable.deckScroll',
  refresh: () => onPage('Decks'),
});

onPage('Decks', function () {
  debug('Deckscroll');
  if (settings.value('underscript.disable.deckScroll')) return;
  eventManager.on('load', () => {
    debug('load');
    debug($('#deckCardsKINDNESS').offset())
    const cardList = $('#yourCardList');
    cardList.css({ 
      'position': 'absolute',
      'max-width': '180px',
    });
    const oOffset = cardList.offset().top - 5;
    let oOffsetDeck;
    $(window).on('scroll.script', () => {
      if (!oOffsetDeck) {
        // Somehow the page isn't loaded completely at load time (very misleading)
        oOffsetDeck = $('#deckCardsKINDNESS').offset().top - 5;
      }
      // Calculated here because cardList can change height
      const maxHeight = 5 + cardList.height() + $('body > footer').height();
      debug(`oOffset:${oOffset}; oOffsetDeck:${oOffsetDeck}; pageOffset:${window.pageYOffset}; maxHeight:${maxHeight}`);
      if (window.innerHeight < maxHeight) {
        // Lock to the deck offset instead
        debug('small screen');
        if (window.pageYOffset > oOffsetDeck) {
          debug('fixed oOffsetDeck');
          $('.deckCardsList').css({
            position: 'fixed',
            width: '180px',
            top: 5,
          });
        } else {
          $('.deckCardsList').css({
            position: '',
            width: '',
            top: '',
          });
        }
        cardList.css({
          position: '',
          top: '',
        });
      } else if (window.pageYOffset > oOffset) {
        debug('fixed oOffset');
        cardList.css({
          position: 'fixed',
          top: 5,
        });
      } else {
        debug('default');
        cardList.css({
          position: 'absolute',
          top: '',
        });
      }
    });
  });
});
