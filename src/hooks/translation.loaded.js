import eventManager from '../utils/eventManager.js';
import { global, globalSet } from '../utils/global.js';

eventManager.on(':loaded', () => {
  const READY = 'translationReady';
  if (global(READY, { throws: false })) {
    eventManager.singleton.emit('translation:loaded');
  } else {
    document.addEventListener(READY, () => {
      eventManager.singleton.emit('translation:loaded');
    }, {
      once: true,
    });
    // Fallback for if translation function breaks
    eventManager.on(':load', () => {
      const translationReady = global(READY, { throws: false });
      if (translationReady !== false) return;
      globalSet(READY, true);
      document.dispatchEvent(global('translationEvent'));
    });
  }
});
