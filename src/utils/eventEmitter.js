wrap(() => {
  function eventEmitter() {
    const events = {
      // eventName: [events]
    };
    const singletonEvents = {
      // eventName: { data }
    };
    const options = {
      cancelable: false,
      singleton: false,
      async: false,
    };

    function reset() {
      const ret = { ...options };
      options.cancelable = false;
      options.singleton = false;
      options.async = false;
      return ret;
    }

    function emit(event, e, data) {
      const {
        cancelable,
        singleton,
        async,
      } = reset();

      if (singleton) { // Need to save even if we don't run
        singletonEvents[event] = {
          data,
        };
      }

      let ran = false;
      let canceled = false;
      const promises = [];

      if (Array.isArray(e) && e.length) {
        ran = true;
        e.forEach((ev) => {
          // Should we stop processing on cancel? Maybe.
          try {
            const meta = { event, cancelable, canceled };
            const ret = ev.call(meta, data);
            if (async && ret !== undefined) {
              promises.push(Promise.resolve(ret)
                .catch((err) => {
                  console.error(`Error occurred while parsing (async) event: ${ev.displayName || ev.name || 'unnamed'}(${event})`, err, data);
                }));
            }
            canceled = !!meta.canceled;
          } catch (err) {
            console.error(`Error occurred while parsing event: ${ev.displayName || ev.name || 'unnamed'}(${event})`, err, data);
          }
        });
      }

      if (async) {
        return Promise.all(promises).then(() => ({
          ran,
          canceled: cancelable && canceled,
        }));
      }

      return {
        ran,
        canceled: cancelable && canceled,
      };
    }

    const emitter = {
      on: (event, fn) => {
        reset();
        if (typeof fn !== 'function') return emitter;
        event.split(' ').forEach((e) => {
          const singleton = singletonEvents[e];
          if (singleton) {
            sleep().then(() => {
              reset(); // Make sure nothing is set!
              emit(e, [fn], singleton.data);
            });
          } else {
            if (!Object.hasOwnProperty.call(events, e)) {
              events[e] = [];
            }
            events[e].push(fn);
          }
        });
        return emitter;
      },
      emit: (event, data, cancelable = false) => {
        if (cancelable) {
          console.error('Deprecation Warning: emit argument "cancelable" is deprecated. Use `.cancelable.emit()` instead!');
          options.cancelable = true;
        }
        return emit(event, singletonEvents[event] || events[event], data);
      },
      emitJSON: (event, data, cancelable) => emitter.emit(event, JSON.parse(data), cancelable),
    };

    Object.keys(options).forEach((key) => {
      Object.defineProperty(emitter, key, {
        get: () => {
          options[key] = true;
          return emitter;
        },
      });
    });

    Object.freeze(emitter);

    return emitter;
  }
  fn.eventEmitter = eventEmitter;
});
