import eventManager from '../../utils/eventManager';
import { global, globalSet } from '../../utils/global';
import { errorToast } from '../../utils/2.toasts';
import onPage from '../../utils/onPage';

onPage('Play', setup);

let waiting = true;

function setup() {
  eventManager.on('socketOpen', () => {
    const socket = global('socketQueue');
    socket.addEventListener('close', announce);
    globalSet('onbeforeunload', function onbeforeunload() {
      socket.removeEventListener('close', announce);
      this.super();
    });
  });

  eventManager.on('Play:Message', (data) => {
    switch (data.action) {
      default:
        waiting = false;
        return;
      case 'getLeaveQueue':
        waiting = true;
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
