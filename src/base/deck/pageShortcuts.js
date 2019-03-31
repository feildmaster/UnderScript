wrap(function pageShortcuts() {
  const disable = settings.register({
    name: 'Disable First/Last Page Shortcut',
    key: 'underscript.disable.quickpages',
    page: 'Chat',
  });

  if (onPage('Crafting') || onPage('Decks')) {
    function ignore(e) {
      const ignore = disable.value() || !e.ctrlKey;
      if (ignore && [0, global('getMaxPage')()].includes(global('currentPage'))) hover.hide();
      return ignore;
    }
    function firstPage(e) {
      if (ignore(e)) return;
      e.preventDefault();
      hover.hide();
      global('showPage')(0);
      $('#btnPrevious').prop('disabled', true);
      $('#btnNext').prop('disabled', false);
    }
    function lastPage(e) {
      if (ignore(e)) return;
      e.preventDefault();
      hover.hide();
      global('showPage')(global('getMaxPage')());
      $('#btnNext').prop('disabled', true);
      $('#btnPrevious').prop('disabled', false);
    }

    eventManager.on('jQuery', function () {
      $('#btnNext').on('click.script', lastPage).hover(hover.show('CTRL Click: Go to last page'));
      $('#btnPrevious').on('click.script', firstPage).hover(hover.show('CTRL Click: Go to first page'));
    });
  }
});
