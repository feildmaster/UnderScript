onPage('Decks', function deckPage() {
  debug('Deck editor');
  eventManager.on('jQuery', () => {
    $(document).ajaxSuccess((event, xhr, options) => {
      if (options.url !== 'DecksConfig' || !options.data) return;
      const data = JSON.parse(options.data);
      const obj = Object.freeze({ data, options, xhr });
      eventManager.emit('Deck:Change', obj);
      eventManager.emit(`Deck:${data.action}`, obj);
    });
    $(document).ajaxComplete((event, xhr, options) => {
      if (options.url !== 'DecksConfig') return;
      if (options.type === 'GET') {
        eventManager.emit('Deck:Loaded', xhr.responseJSON);
        return;
      }
      const data = JSON.parse(options.data);
      const obj = Object.freeze({ data, options, xhr });
      eventManager.emit('Deck:postChange', obj);
      eventManager.emit(`Deck:${data.action}`, obj);
    });
    // Class change
    $('#selectSouls').change(function soulChange() {
      // Sometimes it takes too long, so lets change it now
      const val = $(this).val();
      globalSet('soul', val);
      eventManager.emit('Deck:Soul', val);
    });
  });
});
