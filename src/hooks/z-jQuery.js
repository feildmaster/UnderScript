import eventManager from '../utils/eventManager.js';

// Attempt to detect jQuery
eventManager.on(':preload', () => {
  if (typeof jQuery === 'undefined') return;
  eventManager.singleton.emit('jQuery');
});
