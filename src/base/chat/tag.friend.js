wrap(() => {
  const tag = settings.register({
    name: 'Highlight <span class="friend">friends</span> in chat',
    key: 'underscript.tag.friend',
    default: true,
    page: 'Chat',
  });

  const color = settings.register({
    name: 'Friend color',
    key: 'underscript.tag.friend.color',
    type: 'color',
    default: '#b1bfbe',
    page: 'Chat',
    onChange: setColor,
  });

  setColor(color.value());

  eventManager.on('ChatDetected', function friendWrapper() {
    let toast;
    function processMessage(message, room) {
      if (!tag.value()) return;
      if (isFriend(message.user.id)) {
        if (!toast) {
          toast = fn.infoToast('<span class="friend">Friends</span> are now highlighted in chat.', 'underscript.notice.highlighting', '1');
        }
        $(`#${room} #message-${message.id} .chat-user`).addClass('friend');
        if (message.me) { // emotes
          $(`#${room} #message-${message.id} .chat-message`).addClass('friend');
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

  function setColor(color) {
    style.add(`.friend { color: ${color} !important; }`);
  }
});
