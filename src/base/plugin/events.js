import eventManager from '../../utils/eventManager';
import wrap from '../../utils/2.pokemon';
import { registerModule } from '../../utils/plugin';

wrap(() => {
  const options = ['cancelable', 'canceled', 'singleton', 'async'];

  const name = 'events';
  function mod(plugin) {
    const obj = {
      ...eventManager,
      on(event, fn) {
        if (typeof fn !== 'function') throw new Error('Must pass a function');

        function pluginListener(...args) {
          try {
            fn.call(this, ...args);
          } catch (e) {
            plugin.logger.error(`Event error (${event}):\n`, e, '\n', {
              args,
              event: this,
            });
          }
        }

        eventManager.on.call(obj, event, pluginListener);
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
