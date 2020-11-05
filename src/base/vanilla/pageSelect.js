wrap(() => {
  const disable = settings.register({
    name: 'Disable Page Select',
    key: 'underscript.disable.pageselect',
  });

  const select = document.createElement('select');
  select.value = 0;
  select.id = 'selectPage';
  select.onchange = () => {
    changePage(select.value);
    if (onPage('leaderboard')) {
      eventManager.emit('Rankings:selectPage', select.value);
    }
  };

  function init() {
    const maxPage = global('getMaxPage')();
    if (maxPage - 1 === select.length) return;
    const local = $(select).empty();
    for (let i = 0; i <= maxPage; i++) {
      local.append(`<option value="${i}">${i + 1}</option>`);
    }
    select.value = global('currentPage');
  }

  function changePage(page) {
    select.value = page;
    if (typeof page !== 'number') page = parseInt(page, 10);
    globalSet('currentPage', page);
    global('showPage')(page);
    $('#btnNext').prop('disabled', page === global('getMaxPage')());
    $('#btnPrevious').prop('disabled', page === 0);
  }

  eventManager.on(':loaded', () => {
    if (disable.value() || !global('getMaxPage', { throws: false })) return;
    // Add select dropdown
    $('#currentPage').after(select).hide();

    // Initialization
    globalSet('applyFilters', function applyFilters(...args) {
      this.super(...args);
      setTimeout(init);
    }, { throws: false });
    globalSet('setupLeaderboard', function setupLeaderboard(...args) {
      this.super(...args);
      setTimeout(() => {
        init();
        eventManager.emit('Rankings:init');
      });
    }, { throws: false });

    // Update
    globalSet('showPage', function showPage(page) {
      this.super(page);
      select.value = page;
    });

    fn.changePage = changePage;
  });
});
