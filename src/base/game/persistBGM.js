import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global } from '../../utils/global';

const setting = settings.register({
  name: 'Persist Arena (Background and Music)',
  key: 'underscript.persist.bgm',
  default: true,
  refresh: () => window.gameId !== undefined,
  page: 'Game',
});

eventManager.on('GameStart', () => {
  eventManager.on('connect', (data) => {
    const val = sessionStorage.getItem(`underscript.bgm.${data.gameId}`);
    if (setting.value() && val) {
      $('body').css('background-image', `url('images/backgrounds/${val}.png')`);
    }
  });

  eventManager.on('playBackgroundMusic', (data) => {
    if (!setting.value()) return;
    const key = `underscript.bgm.${global('gameId')}`;
    const background = sessionStorage.getItem(key);
    if (background) {
      data.name = background;
    } else {
      sessionStorage.setItem(key, data.name);
    }
  });
});
