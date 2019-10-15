wrap(() => {
  style.add(
    '#game-history.left { width: 75px; left: -66px; top: 70px; overflow-y: auto; right: initial; height: 454px; }',
    '#game-history.left::-webkit-scrollbar { width: 8px; background-color: unset;  }',
    '#game-history.left::-webkit-scrollbar-thumb { background-color: #555; }',
    '#game-history.hidden { display: none; }',
  );

  const BattleLogSetting = 'underscript.disable.logger';
  const setting = settings.register({
    name: 'Disable Undercards Battle Log',
    key: 'underscript.disable.gamelog',
    page: 'Game',
    onChange: (to) => {
      if (gameActive) toggle(to);
    },
  });
  let gameActive = false;

  eventManager.on('GameStart', () => {
    gameActive = true;
    eventManager.on(':load', () => {
      if (setting.value()) toggle(true);
      if (!settings.value(BattleLogSetting)) toggle(true, 'left');
    });

    settings.on(BattleLogSetting, (to) => {
      toggle(!to, 'left');
    });

    eventManager.on('getBattleLog', (data) => {
      // appendBattleLog
    });
  });

  function toggle(to, clazz = 'hidden') {
    $('#game-history').toggleClass(clazz, to);
  }
});
