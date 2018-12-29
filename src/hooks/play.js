onPage("Play", function () {
  // TODO: Better "game found" support
  debug("On play page");

  (function hook() {
    if (typeof socketQueue === "undefined") {
      debug("Play: Timeout hook");
      return setTimeout(hook);
    }
    socket = socketQueue;
    const oOpen = socketQueue.onopen;
    socketQueue.onopen = function onOpenScript(event) {
      oOpen(event);
      eventManager.emit('socketOpen');
    };
    const oHandler = socketQueue.onmessage;
    socketQueue.onmessage = function onMessageScript(event) {
      const data = JSON.parse(event.data);
      oHandler(event);
      eventManager.emit(data.action, data);
    };
  })();
});
