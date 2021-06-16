wrap(() => {
  const limits = {
    BASE: 3,
    COMMON: 3,
    RARE: 3,
    EPIC: 2,
    LEGENDARY: 1,
    DETERMINATION: 1,
  };

  onPage('Decks', () => {
    function buildPool(shinyFilter) {
      const cards = [{ id: 0, shiny: false, rarity: '' }];
      cards.shift();

      const collection = global('deckCollections')[global('soul')];
      collection.forEach((card = { id: 0, quantity: 0, shiny: false }) => {
        if (shinyFilter !== undefined && card.shiny !== shinyFilter) return;
        for (let i = 0; i < card.quantity; i++) {
          cards.push(card);
        }
      });

      fn.shuffle(cards);
      return cards;
    }

    function buildArtifacts() {
      const current = [...global('decksArtifacts')[global('soul')]];
      const available = [...global('userArtifacts')].filter((a) => !current.includes(a));

      if (current.length === 0) {
        current.push(random(available));
      }

      if (current.length < 2 && !current[0].legendary) {
        const commons = available.filter((a) => !a.legendary && a !== current[0]);
        current.push(random(commons));
      }

      return current;
    }

    function fillDeck() {
      const cDeck = global('decks')[global('soul')];
      const cArts = global('decksArtifacts')[global('soul')];
      const artifacts = buildArtifacts();
      if (cDeck.length === 25 && cArts.length === artifacts.length) return;

      const counts = new Map();
      const cards = [];
      let dtFlag = false;

      function addCard(card) {
        const amt = counts.get(card.id) || 0;
        if (amt === limits[card.rarity]) return;
        if (card.rarity === 'DETERMINATION') {
          if (dtFlag) return;
          dtFlag = true;
        }
        cards.push(card);
        counts.set(card.id, amt + 1);
      }

      cDeck.forEach(addCard);

      // Fill deck with cards
      const pool = buildPool();
      while (cards.length < 25 && pool.length) {
        addCard(pool.shift());
      }

      // Load deck
      fn.deckLoader.load({
        cards,
        artifacts,
      });
    }

    eventManager.on(':loaded', () => {
      style.add('.btn { padding: 5px 6px; }');
      const button = $('<button>');
      const inner = $('<span>');
      inner.addClass('glyphicon glyphicon-random');
      button.addClass('btn btn-sm btn-primary');
      button.append(inner);
      button.click(fillDeck);
      button.hover(hover.show('Randomly fill deck'), hover.hide);
      const clearDeck = $('#yourCardList > button:last');
      clearDeck.after(' ', button);
    });
  });

  function random(array = []) {
    return array[fn.rand(array.length)];
  }
});
