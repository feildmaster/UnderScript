wrap(function page() {
  if (!onPage('leaderboard')) return;
  const select = document.createElement('select');
  select.value = 0;
  select.id = 'selectPage';
  function init() {
    const local = $(select);
    const maxPage = global('getMaxPage')();
    for (let i = 0; i <= maxPage; i++) {
      local.append(`<option value="${i}">${i + 1}</option>`);
    }
  }

  function changePage(page) {
    select.value = page;
    if (typeof page !== 'number') page = parseInt(page, 10);
    console.log('changePage:', page, select.value || '(wtf)');
    globalSet('currentPage', page);
    global('showPage')(page);
    $('#btnNext').prop('disabled', page === global('getMaxPage')());
    $('#btnPrevious').prop('disabled', page === 0);
    $('#btnFirst').prop('disabled', page === 0);
  }

  eventManager.on(':loaded', () => {
    select.onchange = () => {
      changePage(select.value);
      eventManager.emit('Rankings:selectPage', select.value);
    }
    $('#currentPage').after(select).hide();
    globalSet('initLeaderboard', function (...args) {
      this.super(...args);
      init();
      eventManager.emit('Rankings:init');
    });
    globalSet('showPage', function (page) {
      this.super(page);
      select.value = page;
    });
  });

  fn.changePage = changePage;
});
