import eventManager from './eventManager';
import wrap from './2.pokemon';

export default function compound(...events) {
  const callback = events.pop();
  if (typeof callback !== 'function') throw new Error('Callback not provided');
  const cache = {};
  let triggered = 0;
  function trigger(event, ...data) {
    if (cache[event].triggered) return;
    cache[event].triggered = true;
    triggered += 1;

    if (triggered === events.length) {
      events.forEach((ev) => cache[ev].triggered = false);
      triggered = 0;
      wrap(callback);
    }
  }

  events.forEach((ev) => {
    cache[ev] = {
      triggered: false,
    };
    eventManager.on(ev, (...data) => {
      trigger(ev, ...data);
    });
  });
}
