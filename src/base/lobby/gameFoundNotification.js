import onPage from 'src/utils/onPage.js';
import active from 'src/utils/active.js';
import notify from 'src/utils/notifications.js';
import compound from 'src/utils/compoundEvent';
import Translation from 'src/structures/constants/translation';

onPage('Play', () => {
  compound('getWaitingQueue', 'underscript:ready', function gameFound() {
    if (!active()) {
      notify(Translation.General('match.found'));
    }
  });
});
