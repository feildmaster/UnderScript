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
    let oOffset = cardList.offset().top - 5;
    let oOffsetDeck;

    function reset() {
      cardList.css({
        position: 'absolute',
        top: '',
      });
      $('.deckCardsList').css({
        position: '',
        width: '',
        top: '',
      });
    }
    function deck() {
      return $(`#deckCards${classe}`);
    }
    function resize() {
      if (!oOffsetDeck) {
        // Somehow the page isn't loaded completely at load time (very misleading)
        oOffsetDeck = deck().offset().top - 5;
      }
      // Calculated here because cardList can change height
      const footerHeight = $('body > footer').height();
      const maxHeight = 5 + cardList.height() + footerHeight;
      //debug(`oOffset:${oOffset}; oOffsetDeck:${oOffsetDeck}; pageOffset:${window.pageYOffset}; maxHeight:${maxHeight}`);
      if (window.innerHeight < maxHeight) {
        debug(`${window.innerHeight}, ${maxHeight}, ${window.pageYOffset}, ${oOffsetDeck}, ${deck().height()}`);
        // Lock to the deck offset instead
        debug('small screen');
        if (window.pageYOffset > oOffsetDeck && window.innerHeight > deck().height() + footerHeight) {
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
        reset();
      }
    }

    eventManager.on('addCardtoDeck', resize);
    $(window).on('resize.script', () => {
      oOffset = cardList.offset().top - 5;
      oOffsetDeck = deck().offset().top - 5;
      reset();
      resize();
    });
    $(window).on('scroll.script', resize);
  });
});
