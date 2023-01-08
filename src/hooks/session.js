import eventManager from '../utils/eventManager.js';
import { global } from '../utils/global.js';

eventManager.on('Chat:Connected', () => {
  const sessID = sessionStorage.getItem('UserID');
  const selfId = global('selfId');
  if (sessID && sessID === selfId) return;
  sessionStorage.setItem('UserID', selfId);
});
eventManager.on('logout', () => {
  sessionStorage.removeItem('UserID');
});
