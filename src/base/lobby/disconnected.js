import eventManager from '../../utils/eventManager.js';
import { globalSet } from '../../utils/global.js';
import { errorToast } from '../../utils/2.toasts.js';
import onPage from '../../utils/onPage.js';

onPage('Play', setup);

let waiting = true;

function setup() {
  eventManager.on('socketOpen', (socket) => {
    socket.addEventListener('close', announce);
    globalSet('onbeforeunload', function onbeforeunload() {
      socket.removeEventListener('close', announce);
      this.super();
    });
  });

  eventManager.on('Play:Message', (data) => {
    switch (data.action) {
      case 'getLeaveQueue':
        waiting = true;
        break;
      default:
        waiting = false;
    }
  });
}

function announce() {
  if (waiting) {
    eventManager.emit('closeQueues', 'Disconnected from queue. Please refresh page.');
  }
  errorToast({
    name: 'An Error Occurred',
    message: 'You have disconnected from the queue, please refresh the page.',
  });
}
