import eventManager from '../../utils/eventManager.js';
import onPage from '../../utils/onPage.js';

onPage('Play', () => {
  const title = document.title;
  eventManager.on('getWaitingQueue', function updateTitle() {
    // Title has been modified
    if (title !== document.title) return;
    document.title = `Undercards - Match found!`;
  });
  eventManager.on('getLeaveQueue', function restoreTitle() {
    document.title = title;
  });
  // infoToast('The page title now changes when a match is found.', 'underscript.notice.play.title', '1');
});
