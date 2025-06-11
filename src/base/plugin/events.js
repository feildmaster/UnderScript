import eventManager from 'src/utils/eventManager.js';
import wrap from 'src/utils/2.pokemon.js';
import { registerModule } from 'src/utils/plugin.js';
import { capturePluginError } from 'src/utils/sentry.js';
import compoundEvent from 'src/utils/compoundEvent.js';

wrap(() => {
  const options = ['cancelable', 'canceled', 'singleton', 'async'];

  const name = 'events';
  function mod(plugin) {
    function log(error, event, args, meta) {
      capturePluginError(plugin, error, {
        args,
        ...meta,
      });
      plugin.logger.error(`Event error (${event}):\n`, error, '\n', JSON.stringify({
        args,
        event: meta,
      }));
    }
    function wrapper(fn, event) {
      function listener(...args) {
        try {
          const val = fn.call(this, ...args);
          if (val instanceof Promise) {
            val.catch((error) => log(error, event, args, this));
          }
          return val;
        } catch (e) {
          log(e, event, args, this);
        }
        return undefined;
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
