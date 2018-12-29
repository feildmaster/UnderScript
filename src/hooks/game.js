onPage("Game", function () {
  debug("Playing Game");
  eventManager.emit("GameStart");
  eventManager.emit("PlayingGame");
  (function hook() {
    if (typeof socket === 'undefined') {
      debug("Game: Timeout hook");
      return setTimeout(hook);
    }
    const oHandler = socket.onmessage;
    socket.onmessage = function onMessageScript(event) {
      const data = JSON.parse(event.data);
      eventManager.emit('PreGameEvent', data);
      oHandler(event);
      eventManager.emit('GameEvent', data);
    };
  })();
});
