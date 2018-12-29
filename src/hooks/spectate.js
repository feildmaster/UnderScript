onPage("gameSpectate", function () {
  debug("Spectating Game");
  eventManager.emit("GameStart");
  (function hook() {
    if (typeof socket === "undefined") {
      debug("Spectate: Timeout hook");
      return setTimeout(hook);
    }
    const oHandler = socket.onmessage;
    socket.onmessage = function onMessageScript(event) {
      const data = JSON.parse(event.data);
      const run = !eventManager.emit('PreGameEvent', data, data.action === 'getResult').canceled;
      if (run) oHandler(event);
      eventManager.emit('GameEvent', data);
    };
  })();
});
