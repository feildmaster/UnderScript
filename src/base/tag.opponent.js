settings.register({
  name: 'Highlight <span style="color: #d94f41">opponents</span> in chat',
  key: 'underscript.tag.opponent',
  default: true,
  page: 'Chat',
});

eventManager.on('PlayingGame', function tagOpponent() {
  style.add('.opponent { color: #d94f41 !important; }');
  function processMessage(message, room) {
    if (!finish && message.user.id === opponentId) {
      $(`#${room} #message-${message.id} .chat-user`).addClass('opponent');
      if (message.me) { // emotes
        $(`#${room} #message-${message.id} .chat-message`).addClass('opponent');
      }
    }
  }

  eventManager.on('Chat:getHistory', (data) => {
    JSON.parse(data.history).forEach((message) => {
      processMessage(message, data.room);
    });
  });
  eventManager.on('Chat:getMessage', function tagFriends(data) {
    processMessage(JSON.parse(data.chatMessage), data.room);
  });
});
