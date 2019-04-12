eventManager.on(':loaded', () => {
  function unload() {
    eventManager.emit(':unload');
    /* This just causes issues, the server should be dealing with disconnects anyway
    const chat = window.socketChat;
    if (chat) {
      chat.onclose = noop;
      chat.close();
    }
    // */
  }
  window.onbeforeunload = unload;
});
