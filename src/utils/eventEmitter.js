wrap(() => {
  function eventEmitter() {
    const events = {
      // eventName: [events]
    };
    return {
      on: function (event, fn) {
        if (typeof fn !== "function") return eventManager;
        event.split(' ').forEach((e) => {
          if (!events.hasOwnProperty(e)) {
            events[e] = [];
          }
          events[e].push(fn);
        });
        return eventManager;
      },
      emit: function (event, data, cancelable = false) {
        const lEvents = events[event];
        let ran = false;
        let canceled = false;
        if (Array.isArray(lEvents) && lEvents.length) {
          ran = true;
          lEvents.forEach(function call(ev) {
            // Should we stop processing on cancel? Probably.
            try {
              const meta = { event, cancelable, canceled };
              ev.call(meta, data);
              canceled = !!meta.canceled;
            } catch (e) {
              console.error(`Error ocurred while parsing event: ${ev.displayName || ev.name || 'unnamed'}(${event})`);
              console.error(e.stack);
            }
          });
        }
        return {
          ran,
          canceled: cancelable && canceled
        };
      },
      emitJSON: function (event, data, cancelable) {
        return this.emit(event, JSON.parse(data), cancelable);
      },
    };
  }
  fn.eventEmitter = eventEmitter;
});
