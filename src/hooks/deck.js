onPage('Decks', function () {
  debug('Deck editor');
  eventManager.on('jQuery', () => {
    $(document).ajaxSuccess((event, xhr, options) => {
      if (options.url !== 'DecksConfig') return;
      const data = JSON.parse(options.data);
      eventManager.emit('Deck:Change', data, options, xhr);
      eventManager.emit(`Deck:${data.action}`, data, options, xhr);
    });
    $(document).ajaxComplete((event, xhr, options) => {
      if (options.url !== 'DecksConfig') return;
      const data = JSON.parse(options.data);
      eventManager.emit('Deck:postChange', data, options, xhr);
      eventManager.emit(`Deck:${data.action}`, data, options, xhr);
    });
  });
});
