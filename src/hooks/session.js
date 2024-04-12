import eventManager from '../utils/eventManager.js';
import { global } from '../utils/global.js';

export const sessionId = window.crypto?.randomUUID() || Math.random().toString();

function login(id, username) {
  eventManager.singleton.emit('login', id, username);
}

if (sessionStorage.getItem('UserID')) {
  login(sessionStorage.getItem('UserID'), sessionStorage.getItem('Username') ?? undefined);
}

eventManager.on('Chat:Connected', () => {
  const sessID = sessionStorage.getItem('UserID');
  const selfId = global('selfId');
  const username = global('selfUsername');
  if (sessID && sessID === selfId) return;
  login(selfId, username);
  sessionStorage.setItem('UserID', selfId);
  sessionStorage.setItem('Username', username);
});
eventManager.on('logout', () => {
  sessionStorage.removeItem('UserID');
  sessionStorage.removeItem('Username');
});

export function isActive() {
  return localStorage.getItem('underscript.session') === sessionId;
}

export function updateIfActive() {
  if (document.hidden || isActive()) return;
  localStorage.setItem('underscript.session', sessionId);
  eventManager.emit('window:active');
}

document.addEventListener('visibilitychange', updateIfActive);

updateIfActive();
