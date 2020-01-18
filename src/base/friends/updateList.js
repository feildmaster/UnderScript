eventManager.on('ChatDetected', () => {
  let updatingFriends = false;
  eventManager.on('Friends:refresh', () => {
    const socketChat = global('socketChat');
    if (socketChat.readyState !== 1) return;
    updatingFriends = true;
    socketChat.send(JSON.stringify({ action: 'getOnlineFriends' }));
  });
  eventManager.on('preChat:getOnlineFriends', function updateFriends(data) {
    if (!updatingFriends) return;
    updatingFriends = false;
    this.canceled = true;
    const friends = {};
    JSON.parse(data.friends).forEach((friend) => {
      friends[friend.id] = friend;
    });
    const selfFriends = global('selfFriends');
    selfFriends.forEach((friend) => {
      // id, online, idGame, username
      const id = friend.id;
      const now = friends[id];
      delete friends[id];
      if (now && friend.online !== now.online) {
        friend.online = now.online;
      }
    });
    $('.nbFriends').text(selfFriends.filter((friend) => friend.online).length);
    script.updateTip && script.updateTip();
  });
});
