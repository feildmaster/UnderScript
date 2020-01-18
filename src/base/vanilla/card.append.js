wrap(function cardEvent() {
  eventManager.on(':loaded', () => {
    globalSet('appendCard', function appendCard(card, container) {
      const element = this.super(card, container);
      eventManager.emit('appendCard()', {
        card, element,
      });
      return element;
    }, {
      throws: false,
    });
  });
});
