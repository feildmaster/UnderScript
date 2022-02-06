import eventManager from '../utils/eventManager';
import { global, globalSet } from '../utils/global';
import each from '../utils/each';

const prefix = 'underscript.history.';
const history = {};

eventManager.on(':loaded', () => {
  each(localStorage, (data, key = '') => {
    if (!key.startsWith(prefix)) return;
    const id = key.substring(prefix.length);
    history[id] = JSON.parse(data);
  });
});

eventManager.on('preChat:getPrivateMessage', function storeHistory(data) {
  if (!this.canceled || data.open) return;

  const userId = data.idRoom;

  const list = history[userId] || [];
  if (!list.length) history[userId] = list;
  list.push(JSON.parse(data.chatMessage));

  const overflow = list.length - 50;
  if (overflow > 0) {
    list.splice(0, overflow);
  }

  localStorage.setItem(`${prefix}${userId}`, JSON.stringify(list));
});

globalSet('openPrivateRoom', function openPrivateRoom(id, username) {
  if (history[id]) {
    global('privateChats')[id] = [...history[id]];
    global('refreshChats')();
  }
  this.super(id, username);
  if (history[id]) { // Done last incase of errors.
    delete history[id];
    localStorage.removeItem(`${prefix}${id}`);
  }
}, {
  throws: false,
});
