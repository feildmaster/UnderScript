import eventManager from '../../utils/eventManager.js';
import wrap from '../../utils/2.pokemon.js';
import { registerModule } from '../../utils/plugin.js';
import { capturePluginError } from '../../utils/sentry.js';
import compoundEvent from '../../utils/compoundEvent.js';

wrap(() => {
  const options = ['cancelable', 'canceled', 'singleton', 'async'];

  const name = 'events';
  function mod(plugin) {
    function wrapper(fn, event) {
      function listener(...args) {
        try {
          fn.call(this, ...args);
        } catch (e) {
          capturePluginError(plugin, e, {
            args,
            ...this,
          });
          plugin.logger.error(`Event error (${event}):\n`, e, '\n', JSON.stringify({
            args,
            event: this,
          }));
        }
      }
      listener.plugin = plugin;
      return listener;
    }
    const obj = {
      ...eventManager,
      compound(...events) {
        const fn = events.pop();
        if (typeof fn !== 'function') throw new Error('Must pass a function');
        if (!events.length) throw new Error('Must pass events');
        if (events.length === 1) throw new Error('Use `events.on` for single events');

        compoundEvent(...events, wrapper(fn, `Compound[${events.join(';')}]`));
      },
      on(event, fn) {
        if (typeof fn !== 'function') throw new Error('Must pass a function');

        if (event.split(' ').includes(':loaded')) {
          plugin.logger.warn('Event manager: `:loaded` is deprecated, ask author to update to `:preload`!');
        }

        eventManager.on.call(obj, event, wrapper(fn, event));
      },
      emit(...args) {
        return eventManager.emit(...args);
      },
    };

    options.forEach((key) => {
      Object.defineProperty(obj.emit, key, {
        get: () => {
          // Toggle the event manager
          eventManager[key]; // eslint-disable-line no-unused-expressions
          // Return our object
          return obj.emit;
        },
      });
    });

    return Object.freeze(obj);
  }

  registerModule(name, mod);
});
