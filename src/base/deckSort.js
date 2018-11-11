settings.register({
  name: 'Disable Deck Sort',
  key: 'underscript.disable.deckSort',
  disabled: true,
});

onPage('Decks', function () {
  eventManager.on('jQuery', () => {
    $(document).ajaxSuccess((event, xhr, settings) => {
      const data = JSON.parse(settings.data);
      if (data.action !== 'addCard') return;
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
    });
  });
});