settings.register({
  name: 'Disable Deck Scroll',
  key: 'underscript.disable.deckScroll',
  disabled: true,
  hidden: true,
});

onPage('Decks', function () {
  const oLoad = window.onload;
  window.onload = () => {
    oLoad();
    const cardList = $('#yourCardList');
    cardList.css({ 
      'position': 'absolute',
      'max-width': '180px',
    });
    const oOffset = cardList.offset().top - 5;
    const oOffsetDeck = $('#deckCardsKINDNESS').offset().top - 5;
    $(window).on('scroll.script', () => {
      // Calculated here because cardList can change height
      const maxHeight = 5 + cardList.height() + $('body > footer').height();
      if (window.innerHeight < maxHeight) {
        // Lock to the deck offset instead
        if (window.pageYOffset > oOffsetDeck) {
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
        cardList.css({
          position: 'fixed',
          top: 5,
        });
      } else {
        cardList.css({
          position: 'absolute',
          top: '',
        });
      }
    });
  };
});
