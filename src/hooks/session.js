import eventManager from '../utils/eventManager';
import { global } from '../utils/global';

eventManager.on('Chat:getSelfInfos', () => {
  const sessID = sessionStorage.getItem('UserID');
  const selfId = global('selfId');
  if (sessID && sessID === selfId) return;
  sessionStorage.setItem('UserID', selfId);
});
eventManager.on('logout', () => {
  sessionStorage.removeItem('UserID');
});
