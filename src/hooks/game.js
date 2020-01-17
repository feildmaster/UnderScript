onPage('Game', function gameHook() {
  debug('Playing Game');
  eventManager.emit('GameStart');
  eventManager.emit('PlayingGame');
  eventManager.on(':loaded', () => {
    function callGameHooks(data, original) {
      const run = !eventManager.emit('PreGameEvent', data, true).canceled;
      try {
        if (run) original(data);
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
      }
      eventManager.emit('GameEvent', data);
    }

    function hookEvent(event) {
      callGameHooks(event, this.super);
    }

    if (undefined !== window.bypassQueueEvents) {
      globalSet('runEvent', hookEvent);
      globalSet('bypassQueueEvent', hookEvent);
    } else {
      debug('Update your code yo');
    }
  });
});
