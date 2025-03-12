import eventManager from '../../utils/eventManager.js';
import streaming from './0.streamer.js';
import * as $el from '../../utils/elementHelper.js';

eventManager.on(':preload:Settings', () => {
  if (!streaming()) return;
  $el.text.contains(document.querySelectorAll('p'), 'Mail :').forEach((e) => {
    e.innerText = 'Mail : <hidden>';
  });
});
