import eventManager from '../utils/eventManager';
import { global } from '../utils/global';

eventManager.on(':loaded', () => {
  if (global('translationReady', { throws: false })) {
    eventManager.singleton.emit('translation:loaded');
  } else {
    document.addEventListener('translationReady', () => {
      eventManager.singleton.emit('translation:loaded');
    }, {
      once: true,
    });
  }
});
