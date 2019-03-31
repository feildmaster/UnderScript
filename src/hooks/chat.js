eventManager.on(':loaded', () => {
  if (typeof socketChat !== 'undefined') {
    debug('Chat detected');
    eventManager.emit('ChatDetected');

    const oHandler = socketChat.onmessage;
    socketChat.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const {action} = data;

      // Populate chatroom names
      if (action === 'getHistory') {
        chatRoomNames[data.room] = data.roomName;
      }
      if (eventManager.emit(`preChat:${action}`, data, true).canceled) return;
      oHandler(event);
      eventManager.emit('ChatMessage', data);
      eventManager.emit(`Chat:${action}`, data);
    }
    eventManager.on('Chat:getHistory', ({room, roomName: name}) => {
      // Send text hook
      const messages = $(`#${room} .chat-messages`);
      $(`#${room} input[type="text"]`).keydown(function (e) {
        if (e.which !== 13) return;

        const data = {
          room, name, messages,
          input: this,
        };
        if (eventManager.emit('Chat:send', data, true).canceled) {
          $(this).val('');
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });
  }
});
