import compound from 'src/utils/compoundEvent';
import eventManager from 'src/utils/eventManager';

// Call "ready" when all critical assets are loaded
compound(
  'translation:underscript',
  () => eventManager.singleton.emit('underscript:ready'),
);
