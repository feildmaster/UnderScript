import eventManager from 'src/utils/eventManager.js';
import onPage from 'src/utils/onPage.js';
import { debug } from 'src/utils/debug.js';
import wrap from 'src/utils/2.pokemon.js';
import { globalSet } from 'src/utils/global.js';
import { window } from 'src/utils/1.variables.js';

function gameHook() {
  debug('Playing Game');
  eventManager.singleton.emit('GameStart');
  eventManager.singleton.emit('PlayingGame');
  eventManager.on(':preload', () => {
    function callGameHooks(data, original) {
      const run = !eventManager.cancelable.emit('PreGameEvent', data).canceled;
      if (run) {
        wrap(() => original(data));
      }
      eventManager.emit('GameEvent', data);
    }

    function hookEvent(event) {
      callGameHooks(event, this.super);
    }

    if (undefined !== window.bypassQueueEvents) {
      globalSet('runEvent', hookEvent);
      globalSet('bypassQueueEvent', hookEvent);
    } else {
      debug('Update your code yo');
    }
  });
}

onPage('Game', gameHook);
