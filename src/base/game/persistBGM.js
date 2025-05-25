import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { isApril, IMAGES } from 'src/utils/isApril.js';
import { window } from 'src/utils/1.variables.js';
import { aprilFools } from '../vanilla/aprilFools.js';

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
      const path = isApril() && !aprilFools.value() ? IMAGES : 'images';
      $('body').css('background-image', `url('${path}/backgrounds/${val}.png')`);
      // Check special skins
      if (data.gameType !== 'BOSS' && global('profileSkinsEnabled')) {
        global('checkSpecialProfileSkin')(JSON.parse(data.yourProfileSkin));
      }
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
