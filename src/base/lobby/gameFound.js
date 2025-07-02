import Translation from 'src/structures/constants/translation.ts';
import compound from 'src/utils/compoundEvent.js';
import eventManager from 'src/utils/eventManager.js';
import onPage from 'src/utils/onPage.js';

onPage('Play', () => {
  const title = document.title;
  compound('getWaitingQueue', 'underscript:ready', function updateTitle() {
    // Title has been modified
    if (title !== document.title) return;
    document.title = `Undercards - ${Translation.General('match.found')}`;
  });
  eventManager.on('getLeaveQueue', function restoreTitle() {
    document.title = title;
  });
  // infoToast('The page title now changes when a match is found.', 'underscript.notice.play.title', '1');
});
