import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global, globalSet } from '../../utils/global.js';
import onPage from '../../utils/onPage.js';
import sleep from '../../utils/sleep.js';

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

export default function changePage(page) {
  select.value = page;
  if (typeof page !== 'number') page = parseInt(page, 10);
  globalSet('currentPage', page);
  global('showPage')(page);
  $('#btnNext').prop('disabled', page === global('getMaxPage')());
  $('#btnPrevious').prop('disabled', page === 0);
}

eventManager.on(':loaded', () => {
  globalSet('showPage', function showPage(page) {
    if (!eventManager.cancelable.emit('preShowPage', page).canceled) {
      this.super(page);
    }
    eventManager.emit('ShowPage', page);
  }, { throws: false });

  if (disable.value() || !global('getMaxPage', { throws: false })) return;
  // Add select dropdown
  $('#currentPage').after(select).hide();

  // Initialization
  globalSet('applyFilters', function applyFilters(...args) {
    this.super(...args);
    sleep().then(init);
  }, { throws: false });
  globalSet('setupLeaderboard', function setupLeaderboard(...args) {
    this.super(...args);
    sleep().then(() => {
      init();
      eventManager.emit('Rankings:init');
    });
  }, { throws: false });

  // Update
  eventManager.on('ShowPage', (page) => {
    select.value = page;
  });
});
