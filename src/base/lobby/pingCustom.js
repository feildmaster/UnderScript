import { global } from '../../utils/global.js';
import onPage from '../../utils/onPage.js';

onPage('GamesList', function keepAlive() {
  setInterval(() => {
    const socket = global('socket');
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ ping: 'pong' }));
  }, 5000);
});
