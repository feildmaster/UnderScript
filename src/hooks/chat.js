if (typeof onMessage === 'function' && typeof socketChat !== 'undefined') {
  debug('Chat detected');
  eventManager.emit('ChatDetected');

  const oHandler = socketChat.onmessage;
  socketChat.onmessage = (event) => {
    oHandler(event);
    const data = JSON.parse(event.data);
    eventManager.emit('ChatMessage', data);
    eventManager.emit(`Chat:${data.action}`, data);
  }
}
