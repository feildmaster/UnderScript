eventManager.on(':loaded', () => {
  if (typeof socketChat !== 'undefined') {
    debug('Chat detected');
    eventManager.emit('ChatDetected');

    const socketChat = global('socketChat');
    const oHandler = socketChat.onmessage;
    socketChat.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { action } = data;
      debug(data, `debugging.rawchat.${action}`);

      // Populate chatroom names
      if (action === 'getHistory') {
        chatRoomNames[data.room] = fn.translateText(data.roomName);
      }
      if (eventManager.cancelable.emit(`preChat:${action}`, data).canceled) return;
      oHandler(event);
      eventManager.emit('ChatMessage', data);
      eventManager.emit(`Chat:${action}`, data);

      if (action === 'getSelfInfos') {
        eventManager.singleton.emit('Chat:Connected');
      }
    };
    eventManager.on('Chat:getHistory', ({ room, roomName: name }) => {
      // Send text hook
      const messages = $(`#${room} .chat-messages`);
      $(`#${room} input[type="text"]`).keydown(function sending(e) {
        if (e.which !== 13) return;

        const data = {
          room,
          name,
          messages,
          input: this,
        };
        if (eventManager.cancelable.emit('Chat:send', data).canceled) {
          debug('Canceled send');
          $(this).val('');
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });
  }
});
