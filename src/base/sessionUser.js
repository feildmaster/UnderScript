eventManager.on('Chat:getSelfInfos', () => {
  const sessID = sessionStorage.getItem('UserID');
  if (sessID && sessID === selfId) return;
  sessionStorage.setItem('UserID', selfId);
});
eventManager.on('logout', () => {
  sessionStorage.removeItem('UserID');
});
