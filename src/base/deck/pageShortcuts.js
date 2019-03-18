settings.register({
  name: 'Disable First/Last Page Shortcut',
  key: 'underscript.disable.quickpages',
  page: 'Chat',
});

if (onPage('Crafting') || onPage('Decks')) {
  function ignore(e) {
    return settings.value('underscript.disable.quickpages') || !e.ctrlKey;
  }
  function firstPage(e) {
    if (ignore(e)) return;
    e.preventDefault();
    hover.hide();
    showPage(0);
    $('#btnPrevious').prop('disabled', true);
    $('#btnNext').prop('disabled', false);
  }
  function lastPage(e) {
    if (ignore(e)) return;
    e.preventDefault();
    hover.hide();
    showPage(getMaxPage());
    $('#btnNext').prop('disabled', true);
    $('#btnPrevious').prop('disabled', false);
  }

  eventManager.on('jQuery', function () {
    $('#btnNext').on('click.script', lastPage).hover(hover.show('CTRL Click: Go to last page'));
    $('#btnPrevious').on('click.script', firstPage).hover(hover.show('CTRL Click: Go to first page'));
  });
}
