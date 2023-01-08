import eventManager from '../../utils/eventManager.js';
import VarStore from '../../utils/VarStore.js';
import { global } from '../../utils/global.js';

const unpause = VarStore(false);

eventManager.on('Chat:focused', () => {
  const game = global('game', {
    throws: false,
  });
  if (game && game.input) {
    if (!game.paused) {
      game.paused = unpause.set(true);
    }
    const keyboard = game.input.keyboard;
    if (keyboard.disableGlobalCapture) {
      keyboard.disableGlobalCapture();
    } else {
      keyboard.enabled = false;
    }
  }
});

eventManager.on('Chat:unfocused', () => {
  const game = global('game', {
    throws: false,
  });
  if (game && game.input) {
    if (unpause.get()) {
      game.paused = false;
    }
    const keyboard = game.input.keyboard;
    if (keyboard.enableGlobalCapture) {
      keyboard.enableGlobalCapture();
    } else {
      keyboard.enabled = true;
    }
  }
});
