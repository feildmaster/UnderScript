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
    };

    function reset() {
      options.cancelable = false;
      options.singleton = false;
    }

    function emit(event, e, data) {
      const {
        cancelable,
        singleton,
      } = { ...options };
      reset();

      let ran = false;
      let canceled = false;
      if (!singletonEvents[event] && Array.isArray(e) && e.length) {
        ran = true;
        if (singleton) {
          singletonEvents[event] = {
            data,
          };
        }
        e.forEach((ev) => {
          // Should we stop processing on cancel? Maybe.
          try {
            const meta = { event, cancelable, canceled };
            ev.call(meta, data);
            canceled = !!meta.canceled;
          } catch (err) {
            console.error(`Error occurred while parsing event: ${ev.displayName || ev.name || 'unnamed'}(${event})`, err, data);
          }
        });
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
            sleep().then(() => emit(e, [fn], singleton.data));
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
          options.cancelable = true;
        }
        return emit(event, events[event], data);
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
