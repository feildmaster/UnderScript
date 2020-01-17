onPage('Play', () => {
  debug('On play page');

  eventManager.on(':loaded', function hook() {
    debug('Play:Loaded');
    function opened() {
      eventManager.emit('socketOpen');
    }
    globalSet('onOpen', function onOpen(event) {
      this.super(event);
      opened();
    });
    globalSet('onMessage', function onMessage(event) {
      const data = JSON.parse(event.data);
      try {
        this.super(event);
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
      }
      eventManager.emit('Play:Message', data);
      eventManager.emit(data.action, data);
    });

    const socketQueue = global('socketQueue', { throws: false });
    if (socketQueue) {
      if (socketQueue.readyState === WebSocket.OPEN) {
        opened();
      }
      socketQueue.onopen = global('onOpen');
      socketQueue.onmessage = global('onMessage');
    }
  });
});
