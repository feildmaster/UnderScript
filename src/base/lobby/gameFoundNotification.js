import eventManager from '../../utils/eventManager';
import onPage from '../../utils/onPage';
import active from '../../utils/active';
import notify from '../../utils/notifications';

onPage('Play', () => {
  eventManager.on('getWaitingQueue', function gameFound() {
    if (!active()) {
      notify('Match found!');
    }
  });
});
