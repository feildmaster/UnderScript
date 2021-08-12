wrap(() => {
  function gameHook() {
    debug('Playing Game');
    eventManager.singleton.emit('GameStart');
    eventManager.singleton.emit('PlayingGame');
    eventManager.on(':loaded', () => {
      function callGameHooks(data, original) {
        const run = !eventManager.cancelable.emit('PreGameEvent', data).canceled;
        if (run) {
          wrap(() => original(data));
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
  }

  onPage('Game', gameHook);
});
