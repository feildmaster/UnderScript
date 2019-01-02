settings.register({
  name: 'Disable Game List Resizing',
  key: 'underscript.disable.adjustSpectateView',
  refresh: () => onPage(''),
});

onPage('', function adjustSpectateView() {
  if (settings.value('underscript.disable.adjustSpectateView')) return;
  eventManager.on('load', () => {
    const spectate = $('.spectateTable');
    const tbody = $('.spectateTable tbody');
    const footer = $('.mainContent footer');
    function doAdjustment() {
      tbody.css({height: 'auto', 'max-height': `${footer.offset().top - spectate.offset().top}px`});
    }
    $('.mainContent > br').remove();
    doAdjustment();
    $(window).on('resize.script', doAdjustment);
  });
});
