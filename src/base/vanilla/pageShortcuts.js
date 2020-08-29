wrap(function pageShortcuts() {
  const disable = settings.register({
    name: 'Disable First/Last Page Shortcut',
    key: 'underscript.disable.quickpages',
    page: 'Library',
  });

  function ignoring(e) {
    const ignore = disable.value() || !e.ctrlKey;
    if (ignore && [0, global('getMaxPage')()].includes(global('currentPage'))) hover.hide();
    return ignore;
  }
  function firstPage(e) {
    if (ignoring(e)) return;
    e.preventDefault();
    hover.hide();
    global('showPage')(0);
    $('#currentPage').text(1);
    $('#btnPrevious').prop('disabled', true);
    $('#btnNext').prop('disabled', false);
  }
  function lastPage(e) {
    if (ignoring(e)) return;
    e.preventDefault();
    hover.hide();
    const page = global('getMaxPage')();
    global('showPage')(page);
    $('#currentPage').text(page + 1);
    $('#btnNext').prop('disabled', true);
    $('#btnPrevious').prop('disabled', false);
  }

  eventManager.on('jQuery', () => {
    if (!global('getMaxPage', { throws: false })) return;
    $('#btnNext').on('click.script', lastPage).hover(hover.show('CTRL Click: Go to last page'));
    $('#btnPrevious').on('click.script', firstPage).hover(hover.show('CTRL Click: Go to first page'));
  });
});
