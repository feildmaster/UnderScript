eventManager.on(':loaded', () => {
  const fetchAllCards = global('fetchAllCards', { throws: false });
  if (!fetchAllCards) return;
  menu.addButton({
    text: 'Reload cards',
    action() {
      localStorage.removeItem('cardsVersion');
      fetchAllCards();
    },
  });
});
