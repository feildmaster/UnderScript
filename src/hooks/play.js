onPage("Play", function () {
  debug("On play page");

  eventManager.on(':loaded', function hook() {
    debug('Play:Loaded');
    function opened() {
      eventManager.emit('socketOpen');
    }
    const oOpen = onOpen, oHandler = onMessage;
    onOpen = function onOpenScript(event) {
      oOpen(event);
      opened();
    };
    onMessage = function onMessageScript(event) {
      const data = JSON.parse(event.data);
      try {
        oHandler(event);
      } catch(e) {
        console.error(e);
      }
      eventManager.emit('Play:Message', data);
      eventManager.emit(data.action, data);
    };
    if (socketQueue) {
      if (socketQueue.readyState === WebSocket.OPEN) {
        opened();
      }
      socketQueue.onopen = onOpen;
      socketQueue.onmessage = onMessage;
    }
  });
});
