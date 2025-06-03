import sleep from './sleep.js';

export default function eventEmitter() {
  const events = {
    // eventName: [events]
  };
  const singletonEvents = {
    // eventName: { data, async }
  };
  const options = {
    cancelable: false,
    canceled: false,
    singleton: false,
    async: false,
  };
  options.cancelable = undefined;

  function reset() {
    const ret = { ...options };
    options.cancelable = undefined;
    options.canceled = false;
    options.singleton = false;
    options.async = false;
    return ret;
  }

  function emit(event, e, ...data) {
    const {
      canceled: canceledState,
      cancelable = canceledState,
      singleton,
      async,
    } = reset();

    const delayed = e !== events[event];

    // If this event has run previously, don't run it again
    if (singletonEvents[event] && !delayed) {
      const ret = {
        ran: false,
        canceled: false,
      };
      if (async) return Promise.resolve(ret);
      return ret;
    }

    if (singleton) { // Need to save even if we don't run
      singletonEvents[event] = {
        data,
        async,
      };
    }

    let ran = false;
    let canceled = canceledState;
    const promises = [];

    if (Array.isArray(e) && e.length) {
      ran = true;
      [...e].forEach((ev) => {
        // Should we stop processing on cancel? Maybe.
        try {
          const meta = { event, cancelable, canceled, async, delayed, singleton };
          const ret = ev.call(meta, ...data);
          if (async && ret !== undefined) {
            promises.push(Promise.resolve(ret)
              .then(() => canceled = !!meta.canceled) // This is so broken, should process these one at a time
              .catch((err) => {
                console.error(`Error occurred while parsing (async) event: ${ev.displayName || ev.name || 'unnamed'}(${event})`, err, ...data);
              }));
          }
          canceled = !!meta.canceled;
        } catch (err) {
          console.error(`Error occurred while parsing event: ${ev.displayName || ev.name || 'unnamed'}(${event})`, err, ...data);
        }
      });
    }

    function results() {
      return {
        ran,
        canceled: cancelable && canceled,
      };
    }

    if (async) {
      return Promise.all(promises).then(results);
    }

    return results();
  }

  function off(event, fn) {
    event.split(' ').forEach((e) => {
      const list = events[e] || [];
      while (list.includes(fn)) {
        list.splice(list.indexOf(fn), 1);
      }
    });
  }

  const emitter = {
    on(event, fn) {
      reset();
      if (typeof fn !== 'function') return this;
      event.split(' ').forEach((e) => {
        const singleton = singletonEvents[e];
        if (singleton) {
          sleep().then(() => {
            reset(); // Make sure nothing is set!
            options.async = singleton.async;
            emit(e, [fn], ...singleton.data);
          });
        } else {
          if (!Array.isArray(events[e])) {
            events[e] = [];
          }
          events[e].push(fn);
        }
      });
      return this;
    },
    once(event, fn) {
      if (typeof fn !== 'function') return this;
      function wrapper(...args) {
        off(event, wrapper);
        fn.call(this, ...args);
      }
      return this.on(event, wrapper);
    },
    one(event, fn) {
      return this.once(event, fn);
    },
    until(event, fn) {
      if (typeof fn !== 'function') return this;
      function wrapper(...args) {
        const ret = fn.call(this, ...args);
        if (ret instanceof Promise) {
          ret.then((val) => val && off(event, wrapper));
        } else if (ret) {
          off(event, wrapper);
        }
      }
      return this.on(event, wrapper);
    },
    emit: (event, ...data) => emit(event, singletonEvents[event] || events[event], ...data),
    off(event, fn) {
      off(event, fn);
      return this;
    },
  };

  Object.keys(options).forEach((key) => {
    Object.defineProperty(emitter, key, {
      get() {
        options[key] = true;
        return this;
      },
    });
  });

  return Object.freeze(emitter);
}
