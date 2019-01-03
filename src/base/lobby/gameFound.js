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
  fn.infoToast('The page title now changes when a match is found.', 'undercards.notice.play.title', '1');
});
