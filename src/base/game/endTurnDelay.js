settings.register({
  name: 'Disable End Turn Waiting',
  key: 'underscript.disable.endTurnDelay',
  page: 'Game',
});

settings.register({
  name: 'End Turn Wait Time',
  key: 'underscript.endTurnDelay',
  type: 'select',
  options: [],
  disabled: true,
  hidden: true,
  page: 'Game',
});

eventManager.on('PlayingGame', function endTurnDelay() {
  eventManager.on('getTurnStart', function checkDelay() {
    if (global('userTurn') !== global('userId')) return;
    if (global('turn') > 3 && !settings.value('underscript.disable.endTurnDelay')) {
      debug('Waiting');
      $('#endTurnBtn').prop('disabled', true);
      setTimeout(() => {
        $('#endTurnBtn').prop('disabled', false);
      }, 3000);
    }
  });
});
