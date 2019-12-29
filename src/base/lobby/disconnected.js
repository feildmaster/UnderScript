wrap(function disconnected() {
  onPage('Play', setup);

  let waiting = true;

  function setup() {
    eventManager.on('socketOpen', () => {
      const socket = global('socketQueue');
      socket.addEventListener('close', announce);
      globalSet('onbeforeunload', function () {
        socket.removeEventListener('close', announce);
        this.super();
      });
    });

    eventManager.on('Play:Message', (data) => {
      switch(data.action) {
        default: return waiting = false;
        case 'getLeaveQueue': return waiting = true;
      }
    });
  }

  function announce() {
    if (waiting) {
      eventManager.emit('closeQueues', 'Disconnected from queue. Please refresh page.');
    }
    fn.errorToast({
      name: 'An Error Occurred',
      message: 'You have disconnected from the queue, please refresh the page.',
    });
  }
});
