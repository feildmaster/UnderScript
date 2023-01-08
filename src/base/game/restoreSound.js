import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global } from '../../utils/global.js';

// Restore sound on refresh
eventManager.on('getReconnection connect', () => {
  if (settings.value('gameMusicDisabled')) return;
  let playing = false;
  const music = global('music');
  music.addEventListener('play', () => {
    playing = true;
  });
  function restoreSound() {
    if (playing) return;
    music.play();
  }
  document.addEventListener('click', restoreSound, { once: true, passive: true });
});
