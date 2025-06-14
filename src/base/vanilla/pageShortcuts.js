import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global, globalSet } from 'src/utils/global.js';
import * as hover from 'src/utils/hover.js';
import Translation from 'src/structures/constants/translation';

const disable = settings.register({
  name: Translation.Setting('page.jump'),
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

eventManager.on(':preload', () => {
  if (!global('getMaxPage', { throws: false })) return;
  const next = $('#btnNext').on('click.script', lastPage);
  const prev = $('#btnPrevious').on('click.script', firstPage);
  eventManager.on('underscript:ready', () => {
    prev.hover(hover.show(`${Translation.General('page.first')}`));
    next.hover(hover.show(`${Translation.General('page.last')}`));
  });
});
