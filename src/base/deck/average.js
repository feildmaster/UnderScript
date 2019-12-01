settings.register({
  name: 'Disable deck average counter',
  key: 'underscript.disable.deck.average',
  refresh: onPage('Decks'),
  page: 'Library',
});

// Calculate average
onPage('Decks', () => {
  eventManager.on('jQuery', () => {
    const avg = $('<span>').hover(hover.show('Average gold cost'));
    $('#classInfo span').text('Passive').after(' ', avg);

    function round(amt, dec = 2) {
      return Number.parseFloat(amt).toFixed(dec)
    }

    function count() {
      let val = 0;
      const list = global('decks')[global('soul')];
      list.forEach(({cost}) => val += cost);
      avg.text(`(${round(list.length ? val / list.length : val)})`);
    }

    eventManager.on('Deck:Soul Deck:Change Deck:Loaded', count);
  });
});
