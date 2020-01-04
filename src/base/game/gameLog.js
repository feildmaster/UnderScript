wrap(() => {
  style.add(
    '#game-history.left { width: 75px; left: -66px; top: 70px; overflow-y: auto; right: initial; height: 426px; }',
    '#game-history.left::-webkit-scrollbar { width: 8px; background-color: unset;  }',
    '#game-history.left::-webkit-scrollbar-thumb { background-color: #555; }',
    '#game-history.hidden { display: none; }',
    '.timer.active { left: -65px; height: 26px; line-height: 22px; top: 497px; }',
    //'.timer.active.ally { top: 526px; }',
    //'.timer.active.enemy { top: 39px; }',
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
      if (!settings.value(BattleLogSetting)) {
        toggle(true, 'left');
        timer(true);
      }
    });

    settings.on(BattleLogSetting, (to) => {
      toggle(!to, 'left');
      timer(true);
    });

    eventManager.on('getBattleLog', (data) => {
      // appendBattleLog
    });
  });

  function toggle(to, clazz = 'hidden') {
    $('#game-history').toggleClass(clazz, to);
  }

  function timer(apply) {
    $('div.timer').toggleClass('active', apply);
  }
});
