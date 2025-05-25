import eventManager from 'src/utils/eventManager.js';
import { global, globalSet } from 'src/utils/global.js';
import wrap from 'src/utils/2.pokemon.js';
import { window } from 'src/utils/1.variables.js';

eventManager.on(':preload:Play', function hook() {
  if (undefined !== window.bypassQueueEvents) {
    location.href = '/Game';
    return;
  }
  function opened(socket) {
    eventManager.emit('socketOpen', socket);
  }
  globalSet('onOpen', function onOpen(event) {
    this.super(event);
    opened(global('socketQueue'));
  });
  globalSet('onMessage', function onMessage(event) {
    const data = JSON.parse(event.data);
    eventManager.emit(`pre:${data.action}`, data);
    wrap(() => this.super(event));
    eventManager.emit('Play:Message', data);
    eventManager.emit(data.action, data);
  });

  const socketQueue = global('socketQueue', { throws: false });
  if (socketQueue) {
    if (socketQueue.readyState === WebSocket.OPEN) {
      opened(socketQueue);
    }
    socketQueue.onopen = global('onOpen');
    socketQueue.onmessage = global('onMessage');
  }
});
