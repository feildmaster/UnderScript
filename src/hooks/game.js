onPage("Game", function () {
  debug("Playing Game");
  eventManager.emit("GameStart");
  eventManager.emit("PlayingGame");
  (function hook() {
    if (typeof socket === 'undefined') {
      debug("Game: Timeout hook");
      return setTimeout(hook);
    }
    function callGameHooks(data, original) {
        const run = !eventManager.emit('PreGameEvent', data).canceled;
        try {
          if (run) original(data);
        } catch (e) {
          console.error(e);
        }
        eventManager.emit('GameEvent', data);
    }
    if (undefined !== bypassQueueEvents) {
      const oRunEvent = runEvent;
      const oBypassEvent = bypassQueueEvent;
      runEvent = function runEventScript(event) {
        callGameHooks(event, oRunEvent);
      };
      bypassQueueEvent = function runEventScript(event) {
        callGameHooks(event, oBypassEvent);
      };
    } else {
      const oHandler = socket.onmessage;
      socket.onmessage = function onMessageScript(event) {
        const data = JSON.parse(event.data);
        callGameHooks(data, oHandler);
      };
    }
  })();
});
