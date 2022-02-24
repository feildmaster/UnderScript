import eventManager from '../utils/eventManager';
import { globalSet } from '../utils/global';
import { debug } from '../utils/debug';
import onPage from '../utils/onPage';
import wrap from '../utils/2.pokemon';

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
