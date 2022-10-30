import getExtras from '../../utils/appendCardExtras';
import each from '../../utils/each';
import eventEmitter from '../../utils/eventEmitter';
import eventManager from '../../utils/eventManager';
import { globalSet } from '../../utils/global';
import VarStore from '../../utils/VarStore';

const PREFIX = 'appendCard';
const internal = eventEmitter();
let event = PREFIX;
let data;
const extras = VarStore();

internal.on('set', (e = PREFIX) => {
  event = e;
}).on('pre', (...args) => {
  eventManager.emit(`pre:func:${event}`, ...args);
}).on('post', (...args) => {
  if (event === PREFIX || !args.length) {
    const eventData = data || args;
    if (eventData.length) eventManager.emit(`func:${event}`, ...eventData);
    data = null;
    event = PREFIX; // Reset
  } else {
    data = args;
    if (extras.isSet()) data.push(...extras.value);
    eventManager.emit(`${PREFIX}()`, { // Support old events
      card: args[0],
      element: args[1],
    });
    eventManager.emit(`func:${PREFIX}`, ...data); // Should always call `appendCard`?
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
      extras.value = getExtras(key, args);
      internal.emit('set', key);
      const ret = this.super(...args);
      internal.emit('post');
      return ret;
    });
  }

  const otherKeys = ['showCardHover'];
  each(window, (_, key = '') => {
    if (key !== PREFIX && key.startsWith(PREFIX) || otherKeys.includes(key)) {
      override(key);
    }
  });
});
