import eventManager from 'src/utils/eventManager.js';
import onPage from 'src/utils/onPage.js';
import active from 'src/utils/active.js';
import notify from 'src/utils/notifications.js';

// TODO: translation
onPage('Play', () => {
  eventManager.on('getWaitingQueue', function gameFound() {
    if (!active()) {
      notify('Match found!');
    }
  });
});
