onPage('', function adjustSpectateView() {
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
