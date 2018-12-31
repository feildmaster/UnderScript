onPage('Crafting', () => {
  eventManager.on('jQuery', () => {
    $(document).ajaxComplete((event, xhr, options) => {
      if (options.url !== 'CraftConfig') return;
      const data = JSON.parse(options.data);
      const r = xhr.responseJSON;
      const success = r.status === 'success';
      if (data.action === 'craft') {
        if (success) {
          eventManager.emit('craftcard', {
            id: r.cardId,
            name: r.cardName,
            dust: r.dust,
            shiny: r.shiny,
          });
        }
      } else if (data.action === 'disenchant') {
      } else if (data.action === 'auto') {
      }
    });
  });
});
