import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global, globalSet } from 'src/utils/global.js';
import onPage from 'src/utils/onPage.js';
import Translation from 'src/structures/constants/translation';

const disable = settings.register({
  name: Translation.Setting('minigame.keys'),
  key: 'underscript.minigames.wasd',
  page: 'Lobby',
  category: Translation.CATEGORY_MINIGAMES,
});

function onCreate() {
  this.super();
  if (disable.value()) return;
  const game = global('game');
  const KeyCode = global('Phaser').KeyCode;
  const cursors = game.input.keyboard.addKeys({ up: KeyCode.W, down: KeyCode.S, left: KeyCode.A, right: KeyCode.D });
  globalSet('cursors', cursors);
}

onPage('Play', () => {
  let bound = false;
  eventManager.on('pre:getJoinedQueue', () => {
    if (bound) return;
    const create = global('create', { throws: false });
    if (!create) return;
    globalSet('create', onCreate);
    bound = true;
  });
});
