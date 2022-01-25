wrap(function customGame() {
  eventManager.on(':loaded:GamesList', () => {
    eventManager.singleton.emit('enterCustom');
    const socket = global('socket');
    const oHandler = socket.onmessage;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { action } = data;
      if (eventManager.cancelable.emit(`preCustom:${action}`, data).canceled) return;
      oHandler(event);
      eventManager.emit(`Custom:${action}`, data);
    };
  });
});
