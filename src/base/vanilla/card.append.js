wrap(function cardEvent() {
  eventManager.on(':loaded', () => {
    globalSet('appendCard', function (container, card) {
      const element = this.super(container, card);
      eventManager.emit('appendCard()', {
        card, element,
      });
      return element;
    }, {
      throws: false,
    });
  });
});
