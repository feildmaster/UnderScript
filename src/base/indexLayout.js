settings.register({
  name: 'Disable Game List Resizing',
  key: 'underscript.disable.adjustSpectateView',
});

onPage('', function adjustSpectateView() {
  if (localStorage.getItem('underscript.disable.adjustSpectateView')) return;
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
