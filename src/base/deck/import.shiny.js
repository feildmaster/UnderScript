wrap(() => {
  const setting = settings.register({
    name: 'Prefer Shiny',
    key: 'underscript.import.shiny',
    default: true,
    page: 'Library',
    category: 'Import',
  });

  function override(idCard, list = []) {
    if (setting.value()) {
      list.sort((a, b) => b.shiny - a.shiny);
    }
    this.super(idCard, list);
  }

  onPage('Decks', () => {
    eventManager.on(':loaded', () => {
      globalSet('getCardInList', override);
    });
  });
});
