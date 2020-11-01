onPage('Game', () => {
  const regex = /(^| )@o\b/gi;
  let toast = fn.infoToast('You can mention opponents with @o', 'underscript.notice.mention', '1');

  function convert({ input }) {
    if (toast) {
      toast.close('processed');
      toast = null;
    }
    $(input).val($(input).val()
      .replace(regex, `$1@${$('#enemyUsername').text()}`));
  }
  eventManager.on('Chat:send', convert);

  eventManager.on('@autocomplete', ({ list }) => {
    list.push($('#enemyUsername').text());
  });
});
