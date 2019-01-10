eventManager.on('GameStart', function () {
  let finished = false;
  eventManager.on('GameEvent', function logEvent(data) {
    if (finished) { // Sometimes we get events after the battle is over
      fn.debug(`Extra action: ${data.action}`, 'debugging.events.extra');
      return;
    }
    debug(data.action, 'debugging.events.name');
    const emitted = eventManager.emit(data.action, data).ran;
    if (!emitted) {
      fn.debug(`Unknown action: ${data.action}`);
    }
  });
  eventManager.on('PreGameEvent', function callPreEvent(data) {
    if (finished) return;
    const event = eventManager.emit(`${data.action}:before`, data, this.cancelable);
    if (!event.ran) return;
    this.canceled = event.canceled;
  });
  eventManager.on('getVictory getDefeat getResult', function finish() {
    finished = true;
  });
});
