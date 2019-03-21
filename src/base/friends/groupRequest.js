settings.register({
  name: 'Disable decline all button',
  key: 'underscript.disable.declineAll',
  refresh: true,
  page: 'Friends',
});

onPage('Friends', function groupButtons() {
  eventManager.on('jQuery', () => {
    if (settings.value('underscript.disable.declineAll')) return;
    const declineAll = $('<span>');
    const container = $('p:contains("Friend requests")').append(' ', declineAll).parent();
    declineAll.text(' ').addClass('glyphicon glyphicon-remove red').css({
      cursor: 'pointer'
    }).hover(hover.show('Decline all')).click(() => {
      container.find('a[href^="Friends?delete="]').each(function () {
        eventManager.emit('friendAction', $(this));
      });
    });
  });
});