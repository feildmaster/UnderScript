onPage('Decks', function deckPage() {
  debug('Deck editor');
  eventManager.on('jQuery', () => {
    $(document).ajaxSuccess((event, xhr, options) => {
      if (options.url !== 'DecksConfig' || !options.data) return;
      const { action } = JSON.parse(options.data);
      const data = xhr.responseJSON;
      const obj = Object.freeze({ action, data, options, xhr });
      eventManager.emit('Deck:Change', obj);
      eventManager.emit(`Deck:${action}`, obj);
    });
    $(document).ajaxComplete((event, xhr, options) => {
      if (options.url !== 'DecksConfig') return;
      const data = xhr.responseJSON;
      if (options.type === 'GET') {
        eventManager.emit('Deck:Loaded', data);
        return;
      }
      const { action } = JSON.parse(options.data);
      const obj = Object.freeze({ action, data, options, xhr });
      eventManager.emit('Deck:postChange', obj);
      eventManager.emit(`Deck:${action}`, obj);
    });
    // Soul change
    globalSet('updateSoul', function updateSoul() {
      this.super();
      const val = $('#selectSouls').val();
      eventManager.emit('Deck:Soul', val);
    });
  });
});
