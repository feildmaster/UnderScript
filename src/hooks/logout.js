import eventManager from '../utils/eventManager';
import onPage from '../utils/onPage';

onPage('Disconnect', function logout() {
  eventManager.emit('logout');
});
