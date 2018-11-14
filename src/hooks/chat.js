if (typeof onMessage === 'function' && typeof socketChat !== 'undefined') {
  debug('Chat detected');
  eventManager.emit('ChatDetected');

  const oHandler = socketChat.onmessage;
  socketChat.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Populate chatroom names
    if (data.action === 'getHistory') {
      chatRoomNames[data.room] = data.roomName;
    }
    if (eventManager.emit(`preChat:${data.action}`, data, true).canceled) return;
    oHandler(event);
    eventManager.emit('ChatMessage', data);
    eventManager.emit(`Chat:${data.action}`, data);
  }
}
