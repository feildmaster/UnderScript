wrap(() => {
  const name = 'events';
  function mod(plugin) {
    const obj = {
      on(event, fn) {
        if (typeof fn !== "function") throw new Error('Must pass a function');

        function pluginListener(...args) {
          try {
            fn.call(this, ...args);
          } catch(e) {
            plugin.logger.error(`Event error (${event}):\n`, e, '\n', {
              args,
              event: this,
            });
          }
        }

        eventManager.on(event, pluginListener);
      },
      emit(event, data, cancelable = false) {
        return eventManager.emit(event, data, cancelable);
      },
    };

    return Object.freeze(obj);
  }

  registerModule(name, mod);
});
