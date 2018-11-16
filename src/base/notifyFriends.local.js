// Offline never happens, you have to navigate to the friends page before anyone goes "offline" (this caching is weird)
eventManager.on('ChatDetected', () => {
  /*
  let socket;
  function openSocket() {
    socket = new WebSocket(`wss://${location.hostname}/chat`);
    socket.onopen = onOpen;
    socket.onmessage = onMessage;
  }
  function onOpen() {
    socket.send(JSON.stringify({action: 'getOnlineFriends'}));
  }
  function onMessage(event) {
    const data = JSON.parse(event.data);
    let friends;
    if (data.action === 'getSelfInfos' || data.action === 'getOnlineFriends') {
      friends = JSON.parse(data.friends);
    } else {
      return;
    }
    console.log(data.action, friends);
    if (data.action !== 'getOnlineFriends') return;
    socket.close();
    socket = null;
  }

  $(window).on('beforeunload', () => {
    if (socket) socket.close();
  });
  */

  let updatingFriends = false;
  function checkFriends(delay = 10000) {
    setTimeout(() => {
      //openSocket();
      if (socketChat.readyState !== 1) return;
      updatingFriends = true;
      socketChat.send(JSON.stringify({action: 'getOnlineFriends'}));
    }, delay);
  }
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
    checkFriends();
  });
  checkFriends();
});
