import eventManager from 'src/utils/eventManager.js';
import { globalSet } from 'src/utils/global.js';
import { debug } from 'src/utils/debug.js';
import onPage from 'src/utils/onPage.js';
import wrap from 'src/utils/2.pokemon.js';
import { window } from 'src/utils/1.variables.js';

onPage('Spectate', () => {
  eventManager.singleton.emit('GameStart');

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
      debug(`You're a fool.`);
    }
  });
});
