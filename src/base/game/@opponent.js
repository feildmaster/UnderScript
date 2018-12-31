onPage('Game', () => {
  const regex = /(^| )@o\b/g;
  let toast = fn.infoToast('You can mention opponents with @o', 'underscript.notice.mention', '1');

  function convert() {
    if (toast) {
      toast.close('processed');
      toast = null;
    }
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
