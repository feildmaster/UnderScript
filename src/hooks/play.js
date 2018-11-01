// TODO: convert stuff to events (maybe?)
onPage("Play", function () {
  // TODO: Better "game found" support
  debug("On play page");
  let queues, disable = true;
  let restarting = false;

  eventManager.on("jQuery", function onPlay() {
    if (disable) {
      queues = $("button.btn.btn-primary");
      queues.prop("disabled", true);
      restarting = $('p.infoMessage:contains("The server will restart in")').length === 1;
      if (restarting) {
        queues.hover(hover.show('Joining is disabled due to server restart.'));
      }
    }
  });

  (function hook() {
    if (typeof socketQueue === "undefined") {
      debug("Timeout hook");
      return setTimeout(hook);
    }
    socket = socketQueue;
    const oOpen = socketQueue.onopen;
    socketQueue.onopen = function onOpenScript(event) {
      disable = false;
      oOpen(event);
      if (queues && !restarting) queues.prop("disabled", false);
    };
    const oHandler = socketQueue.onmessage;
    socketQueue.onmessage = function onMessageScript(event) {
      const data = JSON.parse(event.data);
      oHandler(event);
      eventManager.emit(data.action, data);
    };
  })();
});
