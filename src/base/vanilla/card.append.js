import each from '../../utils/each';
import eventEmitter from '../../utils/eventEmitter';
import eventManager from '../../utils/eventManager';
import { globalSet } from '../../utils/global';

const PREFIX = 'appendCard';
const internal = eventEmitter();
let event = PREFIX;
let data;

internal.on('set', (e = PREFIX) => {
  event = e;
}).on('pre', (...args) => {
  eventManager.emit(`pre:func:${event}`, ...args);
}).on('post', (...args) => {
  if (event === PREFIX || data && !args.length) {
    eventManager.emit(`func:${event}`, ...(data || args));
    data = null;
    event = PREFIX; // Reset
  } else {
    data = args;
  }
});

eventManager.on(':loaded', () => {
  const set = globalSet(PREFIX, function appendCard(card, container) {
    internal.emit('pre', card);
    const element = this.super(card, container);
    internal.emit('post', card, element);
    return element;
  }, {
    throws: false,
  });
  if (set === undefined) return;

  function override(key) {
    globalSet(key, function func(...args) {
      internal.emit('set', key);
      const ret = this.super(...args);
      internal.emit('post');
      return ret;
    });
  }

  each(window, (_, key = '') => {
    if (key !== PREFIX && key.startsWith(PREFIX) ||
        key === 'showCardHover') override(key);
  });
});
