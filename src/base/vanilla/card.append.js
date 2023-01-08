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
    const eventData = data || args; // If no data then the event was canceled somehow, and we need to clear the event
    if (eventData.length) {
      eventManager.emit(`func:${event}`, ...eventData);
      if (event !== PREFIX) eventManager.emit(`func:${PREFIX}`, ...eventData); // Always call func:appendCard?
    }
    data = null;
    event = PREFIX; // Reset
  } else {
    data = args;
    if (extras.isSet()) data.push(...extras.value);
    eventManager.emit(`func:${PREFIX}`, ...data); // Always call func:appendCard?
  }
});

eventManager.on(':loaded', () => {
  const set = globalSet(PREFIX, function appendCard(card, container) {
    internal.emit('pre', card);
    const element = this.super(card, container);
    if (eventManager.emit(`${PREFIX}()`, { card, element, container }).ran) { // Support old listeners
      console.warn(`'${PREFIX}()' is deprecated, please use 'func:${PREFIX}' instead`);
    }
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
