wrap(function pageShortcuts() {
  const disable = settings.register({
    name: 'Disable First/Last Page Shortcut',
    key: 'underscript.disable.quickpages',
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
    setPage(0);
  }
  function lastPage(e) {
    if (ignoring(e)) return;
    e.preventDefault();
    hover.hide();
    const page = global('getMaxPage')();
    setPage(page, page);
  }
  function setPage(page, max = global('getMaxPage')()) {
    global('showPage')(page);
    globalSet('currentPage', page);
    $('#currentPage').text(page + 1);
    $('#btnNext').prop('disabled', page === max);
    $('#btnPrevious').prop('disabled', page === 0);
  }

  eventManager.on(':loaded', () => {
    if (!global('getMaxPage', { throws: false })) return;
    $('#btnNext').on('click.script', lastPage).hover(hover.show('CTRL Click: Go to last page'));
    $('#btnPrevious').on('click.script', firstPage).hover(hover.show('CTRL Click: Go to first page'));
  });
});
