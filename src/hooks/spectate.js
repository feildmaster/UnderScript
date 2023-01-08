import eventManager from '../utils/eventManager.js';
import { globalSet } from '../utils/global.js';
import { debug } from '../utils/debug.js';
import onPage from '../utils/onPage.js';
import wrap from '../utils/2.pokemon.js';

onPage('Spectate', () => {
  eventManager.singleton.emit('GameStart');

  eventManager.on(':loaded', () => {
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
