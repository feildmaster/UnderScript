eventManager.on('ChatDetected', () => {
  let updatingFriends = false;
  eventManager.on('Friends:refresh', () => {
    if (socketChat.readyState !== 1) return;
    updatingFriends = true;
    socketChat.send(JSON.stringify({action: 'getOnlineFriends'}));
  });
  eventManager.on('preChat:getOnlineFriends', function (data) {
    if (!updatingFriends) return;
    updatingFriends = false;
    this.canceled = true;
    const friends = {};
    JSON.parse(data.friends).forEach((friend) => {
      friends[friend.id] = friend;
    });
    selfFriends.forEach((friend) => {
      // id, online, idGame, username
      const now = friends[friend.id];
      if (friend.online !== now.online) {
        friend.online = now.online;
        fn.toast(`${friend.username} is now ${now.online ? 'online' : 'offline'}.`);
      }
    });
  });
});
