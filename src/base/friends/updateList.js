import eventManager from '../../utils/eventManager.js';
import { global } from '../../utils/global.js';
import sleep from '../../utils/sleep.js';
import updateTip from './online.js';

eventManager.on('preChat:getFriends', function updateFriends(data) {
  this.canceled = true;
  const friends = JSON.parse(data.friends).reduce((ret, friend) => {
    ret[friend.id] = friend;
    return ret;
  }, {});
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
  updateTip();
});

eventManager.on('ChatDetected', () => {
  const timeout = 5000;
  function refresh() {
    const socketChat = global('socketChat');
    if (socketChat.readyState !== 1) return;
    socketChat.send(JSON.stringify({ action: 'getFriends' }));
    sleep(timeout).then(refresh);
  }
  sleep(timeout).then(refresh);
});
