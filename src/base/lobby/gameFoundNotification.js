wrap(() => {
  onPage('Play', () => {
    eventManager.on('getWaitingQueue', function gameFound() {
      if (!fn.active()) {
        fn.notify('Match found!');
      }
    });
  });
});
