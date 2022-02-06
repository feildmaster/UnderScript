import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global, globalSet } from '../../utils/global';
import onPage from '../../utils/onPage';

const setting = settings.register({
  name: 'Use WASD',
  key: 'underscript.minigames.wasd',
  page: 'Lobby',
  category: 'Minigames',
});

function onCreate() {
  this.super();
  if (!setting.value()) return;
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
