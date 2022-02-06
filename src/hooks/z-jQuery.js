import eventManager from '../utils/eventManager';

// Attempt to detect jQuery
eventManager.on(':loaded', () => {
  if (typeof jQuery === 'undefined') return;
  eventManager.singleton.emit('jQuery');
});
