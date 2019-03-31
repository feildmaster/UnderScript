onPage('GamesList', function customGame() {
  eventManager.on(':loaded', () => {
    eventManager.emit('enterCustom');
    const socket = global('socket');
    const oHandler = socket.onmessage;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const {action} = data;
      if (eventManager.emit(`preCustom:${action}`, data, true).canceled) return;
      oHandler(event);
      eventManager.emit(`Custom:${action}`, data);
    };
  });
});
