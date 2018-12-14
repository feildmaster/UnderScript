onPage('Game', () => {
  const regex = /(^| )@o\b/g;
  function convert() {
    $(this).val($(this).val()
    .replace(regex, `$1${$('#enemyUsername').text()}`));
  }
  function onEnter(e) {
    if (e.which === 13) {
      convert.call(this);
    }
  }
  eventManager.on('ChatDetected', () => {
    eventManager.on('Chat:getHistory', (data) => {
      $(`#${data.room} input[type="text"]`).keydown(onEnter);
    });
  });
});
