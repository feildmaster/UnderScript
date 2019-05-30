wrap(function page() {
  if (!onPage('Translate')) return;
  const select = document.createElement('select');
  select.value = 0;
  select.id = 'selectPage';
  select.onchange = () => {
    changePage(select.value);
  };

  function init() {
    const local = $(select).empty();
    const maxPage = global('getMaxPage')();
    for (let i = 0; i <= maxPage; i++) {
      local.append(`<option value="${i}">${i + 1}</option>`);
    }
  }

  function changePage(page) {
    select.value = page;
    if (typeof page !== 'number') page = parseInt(page, 10);
    globalSet('currentPage', page);
    global('showPage')(page);
    $('#btnNext').prop('disabled', page === global('getMaxPage')());
    $('#btnPrevious').prop('disabled', page === 0);
    $('#btnFirst').prop('disabled', page === 0);
  }

  eventManager.on(':loaded', () => {
    $('#currentPage').after(select).hide();
    globalSet('applyFilters', function (...args) {
      this.super(...args);
      init();
    });
    globalSet('showPage', function (page) {
      this.super(page);
      select.value = page;
    });
  });
});
