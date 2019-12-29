settings.register({
  name: 'Persist Arena (Background and Music)',
  key: 'underscript.persist.bgm',
  default: true,
  refresh: window.gameId !== undefined,
  page: 'Game',
});

eventManager.on('GameStart', function () {
  if (!settings.value('underscript.persist.bgm')) return;
  let restartMusic = false;
  eventManager.on('getGameStarted', function rememberBGM(data) {
    const key = `underscript.bgm.${data.gameId}`;
    const value = localStorage.getItem('numBackground');
    sessionStorage.setItem(key, value);
  });
  eventManager.on('getReconnection:before connect:before', function restoreBGM(data) {
    const key = `underscript.bgm.${data.gameId}`;
    if (sessionStorage.getItem(key) && musicEnabled){
      debug('disabling music');
      restartMusic = true;
      musicEnabled = false;
    }
  });
  eventManager.on('getReconnection connect', function restoreBGM(data) {
    const key = `underscript.bgm.${data.gameId}`;
    if (!sessionStorage.getItem(key)) { // Store value for refreshes
      const value = getBGM(data.gameType);
      debug(`set ${key} ${value}`);
      sessionStorage.setItem(key, value);
      return;
    }
    const numBackground = sessionStorage.getItem(key);
    debug(`set ${key} ${numBackground}`);
    $('body').css('background', `#000 url('images/backgrounds/${numBackground}.png') no-repeat`);
    if (restartMusic) {
      debug('restarting music');
      musicEnabled = true;
      music = new Audio(`musics/themes/${numBackground}.ogg`);
      music.volume = 0.1;
      music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
      }, false);
      music.play();
    }
  });

  function getBGM(gameMode) {
    if (gameMode === 'BOSS') {
      return global('bossBackground');
    } else if (gameMode === 'TUTORIAL') {
      return 'tuto';
    }
    return $('body').css('background').match(/url\(\".*\/(\d+).png\"\)/)[1];
  }
});
