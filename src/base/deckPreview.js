settings.register({
  name: 'Disable Deck Preview',
  key: 'underscript.disable.deckPreview',
});

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
    function checkHover(el) {
      const hover = hoverCard(el);
      return (e) => {
        if (!settings.value('underscript.disable.deckPreview')) {
          hover(e);
        }
      };
    }
    $('li.list-group-item').each(function (index) {
      const element = $(this);
      element.hover(checkHover(element));
    });
    $(document).ajaxSuccess((event, xhr, settings) => {
      const data = JSON.parse(settings.data);
      if (data.action === 'removeCard') { // Card was removed, hide element
        hover.hide();
      } else if (data.action === 'addCard') { // Card was added
        const element = $(`#deckCards${data.classe} li:last`);
        element.hover(checkHover(element));
      }
    });
  });
});
