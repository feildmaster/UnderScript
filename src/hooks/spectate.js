onPage("gameSpectate", function () {
  debug("Spectating Game");
  eventManager.emit("GameStart");

  eventManager.on(':loaded', () => {
    if (typeof socket === 'undefined') return;
    function callGameHooks(data, original) {
      const run = !eventManager.emit('PreGameEvent', data, data.action === 'getResult').canceled;
      try {
        if (run) original(data);
      } catch (e) {
        console.error(e);
      }
      eventManager.emit('GameEvent', data);
    }
    if (undefined !== window.bypassQueueEvents) {
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
        const run = !eventManager.emit('PreGameEvent', data, data.action === 'getResult').canceled;
        if (run) oHandler(event);
        eventManager.emit('GameEvent', data);
      };
    }
  });
});
