onPage('Spectate', () => {
  debug('Spectating Game');
  eventManager.singleton.emit('GameStart');

  eventManager.on(':loaded', () => {
    function callGameHooks(data, original) {
      const run = !eventManager.emit('PreGameEvent', data, data.action === 'getResult').canceled;
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
      debug(`You're a fool.`);
    }
  });
});
