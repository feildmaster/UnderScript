const eventManager = fn.eventEmitter();

api.register('eventManager', {
  on(event, fn) {
    if (typeof fn !== "function") throw new Error('Must pass a function');
    eventManager.on(event, fn);
  },
  emit(event, data, cancelable = false) {
    return eventManager.emit(event, data, cancelable);
  },
});
