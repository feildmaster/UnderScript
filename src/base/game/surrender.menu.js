import eventManager from '../../utils/eventManager.js';
import { global } from '../../utils/global.js';
import onPage from '../../utils/onPage.js';
import * as menu from '../../utils/menu.js';

onPage('Game', () => {
  // Unbind the "surrender" hotkey
  eventManager.on('jQuery', () => {
    $(document).off('keyup');
  });
  function canSurrender() {
    return global('turn') >= 5;
  }
  // Add the "surrender" menu button
  menu.addButton({
    text: 'Surrender',
    enabled: canSurrender,
    top: true,
    note: () => {
      if (!canSurrender()) {
        return `You can't surrender before turn 5.`;
      }
      return undefined;
    },
    action: () => {
      const socket = global('socketGame');
      if (socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify({ action: 'surrender' }));
    },
  });
});
