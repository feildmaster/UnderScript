eventManager.on(':loaded', () => {
  function unload() {
    eventManager.emit(':unload');
    const chat = window.socketChat;
    if (chat) {
      chat.onclose = noop;
      chat.close();
    }
  }
  window.onbeforeunload = unload;
});
