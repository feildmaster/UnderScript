import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global, globalSet } from '../../utils/global';

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
      $('body').css('background', `#000 url('images/backgrounds/${val}.png') no-repeat`);
    }
  });

  eventManager.on(':loaded', () => {
    globalSet('playBackgroundMusic', function playBackgroundMusic(sound) {
      if (setting.value()) {
        const key = `underscript.bgm.${global('gameId')}`;
        const background = sessionStorage.getItem(key);
        if (background) {
          return this.super(background);
        }

        sessionStorage.setItem(key, sound);
      }
      return this.super(sound);
    });
  });
});
