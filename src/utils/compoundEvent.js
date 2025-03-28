import eventManager from './eventManager.js';
import wrap from './2.pokemon.js';

export default function compound(...events) {
  const callback = events.pop();
  if (typeof callback !== 'function') throw new Error('Callback not provided');
  const cache = {};
  let triggered = 0;
  // TODO: cache data
  function trigger(event, ...data) {
    if (!cache[event].triggered) {
      cache[event].triggered = this.singleton ? 'singleton' : true;
      triggered += 1;
    }

    if (triggered >= events.length) {
      events.forEach((ev) => {
        const e = cache[ev];
        // Only reset if not singleton
        if (e.triggered !== true) return;
        e.triggered = false;
        triggered -= 1;
      });
      wrap(callback);
    }
  }

  events.forEach((ev) => {
    cache[ev] = {
      triggered: false,
    };
    eventManager.on(ev, function wrapper(...data) {
      trigger.call(this, ev, ...data);
    });
  });
}
