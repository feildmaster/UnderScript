wrap(function hoverWrapper() {
  function wrapper(...rest) {
    this.super(...rest);
    $('#hover-card').click(function () {
      $(this).remove();
    });
  }

  eventManager.on(':loaded', () => {
    const options = {
      throws: false,
    };
    globalSet('displayCardDeck', wrapper, options);
    globalSet('displayCardHelp', wrapper, options);
  });
});
