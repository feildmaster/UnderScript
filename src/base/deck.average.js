settings.register({
  name: 'Disable deck average counter',
  key: 'underscript.disable.deck.average',
  refresh: onPage('Decks'),
});

// Calculate average
onPage('Decks', () => {
  eventManager.on('jQuery', () => {
    const reg = /^.*\((\d+)\)/;
    const avg = $('<span>').hover(hover.show('Average gold cost'));
    $('#decksSizeJUSTICE').after(' ', avg);

    function round(amt, dec = 2) {
      return Number.parseFloat(amt).toFixed(dec)
    }

    function count() {
      let val = 0;
      const list = $(`#deckCards${classe} li`);
      list.each(function () {
        val += parseInt($(this).text().replace(reg, '$1'));
      });
      avg.text(`(${round(list.length ? val / list.length : val)})`);
    }

    window.addEventListener('load', count);
    eventManager.on('Deck:Soul Deck:Change', count);
  });
});
