import eventManager from '../../utils/eventManager.js';
import onPage from '../../utils/onPage.js';
import active from '../../utils/active.js';
import notify from '../../utils/notifications.js';

onPage('Play', () => {
  eventManager.on('getWaitingQueue', function gameFound() {
    if (!active()) {
      notify('Match found!');
    }
  });
});
