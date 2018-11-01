// TODO: Convert to event listeners?
onPage('Decks', function () {
  function hoverCard(element) {
    const id = element.attr('id');
    const shiny = element.hasClass('shiny') ? '.shiny' : '';
    const card = $(`table#${id}${shiny}:lt(1)`).clone();
    if (card.length !== 1) return;
    card.find('#quantity').remove();
    if (card.css('opacity') !== '1') card.css('opacity', 1);
    loadCard(card);
    return hover.show(card);
  }
  // Initial load
  eventManager.on('jQuery', () => {
    $('li.list-group-item').each(function (index) {
      const element = $(this);
      element.hover(hoverCard(element));
    });
    $(document).ajaxSuccess((event, xhr, settings) => {
      const data = JSON.parse(settings.data);
      if (data.action === 'removeCard') { // Card was removed, hide element
        hover.hide();
      } else if (data.action === 'addCard') { // Card was added
        const element = $(`#deckCards${data.classe} li:last`);
        element.hover(hoverCard(element, true));

        const list = $(`#deckCards${data.classe}`);
        list.append(list.children('li').detach().sort(function (a, b) {
          const card1 = $(`table#${$(a).attr('id')}`);
          const card2 = $(`table#${$(b).attr('id')}`);
          const card1cost = parseInt(card1.find('.cardCost').html(), 10);
          const card2cost = parseInt(card2.find('.cardCost').html(), 10);
          if (card1cost === card2cost) {
            const card1name = card1.find('.cardName').html();
            const card2name = card2.find('.cardName').html();
            if (card1name == card2name) return 0;
            return card1name > card2name ? 1 : -1;
          }
          return card1cost > card2cost ? 1 : -1;
        }));
      }
    });
  });

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
