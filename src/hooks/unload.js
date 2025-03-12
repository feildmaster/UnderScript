import { SOCKET_SCRIPT_CLOSED } from '../utils/1.variables.js';
import eventManager from '../utils/eventManager.js';
import { getPageName } from '../utils/onPage.js';

eventManager.on(':preload', () => {
  function unload() {
    eventManager.emit(':unload');
    eventManager.emit(`:unload:${getPageName()}`);

    const chat = window.socketChat;
    if (chat && chat.readyState <= WebSocket.OPEN) chat.close(SOCKET_SCRIPT_CLOSED, 'unload');
  }
  window.onbeforeunload = unload;
});
