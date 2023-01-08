import eventManager from '../utils/eventManager.js';
import onPage from '../utils/onPage.js';

onPage('Disconnect', function logout() {
  eventManager.emit('logout');
});
