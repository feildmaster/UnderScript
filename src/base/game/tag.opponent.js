wrap(() => {
  const tag = settings.register({
    name: 'Highlight <span class="opponent">opponents</span> in chat',
    key: 'underscript.tag.opponent',
    default: true,
    page: 'Chat',
  });
  
  style.add('.opponent { color: #d94f41 !important; }');

  eventManager.on('PlayingGame', function tagOpponent() {
    let toast;
    function processMessage(message, room) {
      if (message.user.id === global('opponentId') && tag.value()) {
        if (!toast) {
          toast = fn.infoToast('<span class="opponent">Opponents</span> are now highlighted in chat.', 'underscript.notice.highlighting.opponent', '1');
        }
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
});
