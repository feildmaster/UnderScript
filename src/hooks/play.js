import eventManager from '../utils/eventManager';
import { global, globalSet } from '../utils/global';
import wrap from '../utils/2.pokemon';

eventManager.on(':loaded:Play', function hook() {
  if (undefined !== window.bypassQueueEvents) {
    location.href = '/Game';
    return;
  }
  function opened() {
    eventManager.emit('socketOpen');
  }
  globalSet('onOpen', function onOpen(event) {
    this.super(event);
    opened();
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
      opened();
    }
    socketQueue.onopen = global('onOpen');
    socketQueue.onmessage = global('onMessage');
  }
});
