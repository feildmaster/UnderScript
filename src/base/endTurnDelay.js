eventManager.on('PlayingGame', function endTurnDelay() {
  eventManager.on('getTurnStart', function checkDelay() {
    if (userTurn !== userId) return;
    if (turn > 3 && !localStorage.getItem('setting.disable.endTurnDelay')) {
      $('#endTurnBtn').prop('disabled', true);
      setTimeout(() => {
        $('#endTurnBtn').prop('disabled', false);
      }, 3000);
    }
  });
});
