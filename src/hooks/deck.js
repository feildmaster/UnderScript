onPage('Decks', function deckPage() {
  debug('Deck editor');
  eventManager.on('jQuery', () => {
    $(document).ajaxSuccess((event, xhr, options) => {
      if (options.url !== 'DecksConfig' || !options.data) return;
      const data = JSON.parse(options.data);
      // TODO: Fix these events.. Oops
      eventManager.emit('Deck:Change', data, options, xhr);
      eventManager.emit(`Deck:${data.action}`, data, options, xhr);
    });
    $(document).ajaxComplete((event, xhr, options) => {
      if (options.url !== 'DecksConfig') return;
      if (options.type === 'GET') {
        eventManager.emit('Deck:Loaded', xhr.responseJSON);
        return;
      }
      const data = JSON.parse(options.data);
      eventManager.emit('Deck:postChange', data, options, xhr);
      eventManager.emit(`Deck:${data.action}`, data, options, xhr);
    });
    // Class change
    $('#selectSouls').change(function soulChange() {
      // Sometimes it takes too long, so lets change it now
      globalSet('soul', $(this).val());
      eventManager.emit('Deck:Soul');
    });
  });
});
