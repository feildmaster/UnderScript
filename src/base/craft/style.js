wrap(() => {
  if (!onPage('Decks')) return;
  eventManager.on(':loaded', () => {
    const collection = $('#collection');
    collection.css({
      width: '717px',
      padding: '0',
    });
    collection.parent().css({
      width: '717px',
    });
  });
});
