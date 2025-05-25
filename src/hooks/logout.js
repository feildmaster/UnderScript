import eventManager from 'src/utils/eventManager.js';
import onPage from 'src/utils/onPage.js';

onPage('Disconnect', function logout() {
  eventManager.singleton.emit('logout');
});
