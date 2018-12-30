eventManager.on('ChatDetected', () => {
  const friendToast = {};
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
      const id = friend.id;
      const now = friends[id];
      delete friends[id];
      if (now && friend.online !== now.online) {
        friend.online = now.online;
        if (friendToast[id]) {
          friendToast[id].close();
        }
        friendToast[id] = fn.toast(`${friend.username} is now ${now.online ? 'online' : 'offline'}.`);
      }
    });
    // New friend? o.o
    fn.each(friends, (friend) => {
      debug(`Adding friend: ${friend.username}`);
      selfFriends.push(friend)
    });
    $('.nbFriends').text(selfFriends.filter((friend) => friend.online).length);
    script.updateTip && script.updateTip();
  });
});
