settings.register({
  name: 'Highlight <span style="color: #77cfac">friends</span> in chat',
  key: 'underscript.tag.friend',
  default: true,
  page: 'Chat',
});

eventManager.on('ChatDetected', function friendWrapper() {
  style.add('.friend { color: #77cfac !important; }');
  function processMessage(message, room) {
    if (!settings.value('underscript.tag.friend')) return;
    if (isFriend(message.user.id)) {
      fn.infoToast('<span class="friend">Friends</span> are now highlighted in chat.', 'underscript.notice.highlighting', '1');
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
