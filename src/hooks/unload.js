eventManager.on(':loaded', () => {
  function unload() {
    eventManager.emit(':unload');
    eventManager.emit(`:unload:${fn.getPageName()}`);
  }
  function last() {
    const chat = window.socketChat;
    if (chat && chat.readyState <= WebSocket.OPEN) chat.close();
  }
  window.onbeforeunload = unload;
  window.onunload = last;
});
