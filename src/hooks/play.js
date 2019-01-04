onPage("Play", function () {
  debug("On play page");

  eventManager.on('loaded', function hook() {
    debug('Play:Loaded');
    const oOpen = onOpen, oHandler = onMessage;
    onOpen = function onOpenScript(event) {
      oOpen(event);
      eventManager.emit('socketOpen');
    };
    onMessage = function onMessageScript(event) {
      const data = JSON.parse(event.data);
      try {
        oHandler(event);
      } catch(e) {
        console.error(e);
      }
      eventManager.emit(data.action, data);
    };
  });
});
