import axios from 'axios';
import * as settings from '../../utils/settings';
import { infoToast } from '../../utils/2.toasts';
import { debugToast } from '../../utils/debug';
import onPage from '../../utils/onPage';
import decrypt from '../../utils/decrypt.emails';
import translate from '../../utils/translate';

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
