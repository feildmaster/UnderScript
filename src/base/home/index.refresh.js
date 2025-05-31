import axios from 'axios';
import * as settings from 'src/utils/settings/index.js';
import { infoToast } from 'src/utils/2.toasts.js';
import debugToast from 'src/utils/debugToast';
import onPage from 'src/utils/onPage.js';
import decrypt from 'src/utils/decrypt.emails.js';
import translate from 'src/utils/translate.js';
import eventManager from 'src/utils/eventManager.js';

const setting = settings.register({
  name: 'Disable Game List Refresh',
  key: 'undercards.disable.lobbyRefresh',
  default: false,
  category: 'Home',
  init() {
    onPage('', setup);
  },
  onChange(val) {
    onPage('', setup);
  },
});

let id;
let refreshing = false;

function clear() {
  if (id) {
    clearTimeout(id);
    id = null;
  }
}

function refresh() {
  clear();
  if (refreshing || document.visibilityState === 'hidden' || setting.value()) return;
  refreshing = true;
  axios.get('/').then((response) => {
    const data = decrypt($(response.data));
    const list = data.find('#liste');
    const live = $('#liste');
    live.find('tbody').html(translate(list.find('tbody')).html());
    live.prev('p').html(translate(list.prev()).html());
    eventManager.emit('Home:Refresh');
  }).catch((e) => {
    debugToast(`Index: ${e.message}`);
  }).then(() => {
    refreshing = false;
    setup();
  });
}

function setup(delay = 10000) {
  clear();
  id = setTimeout(refresh, delay);
}

onPage('', function refreshGameList() {
  // Restart refresh sequence when returning to page
  document.addEventListener('visibilitychange', refresh);
  // Queue initial refresh
  setup();
  infoToast('The game list now refreshes automatically, every 10 seconds.', 'underscript.notice.refreshIndex', '1');
});
