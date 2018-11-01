eventManager.on('PlayingGame', function fixEndTurn() {
  const oEndTurn = endTurn;
  let endedTurn = false;
  endTurn = function restrictedEndTurn() {
    if (endedTurn || $('#endTurnBtn').prop('disabled')) return;
    endedTurn = true;
    oEndTurn();
  };

  eventManager.on('getTurnStart', function turnStarted() {
    if (userTurn !== userId) return;
    endedTurn = false;
    if (turn > 3 && !localStorage.getItem('setting.disable.endTurnDelay')) {
      $('#endTurnBtn').prop('disabled', true);
      setTimeout(() => {
        $('#endTurnBtn').prop('disabled', false);
      }, 3000);
    }
  });
});
