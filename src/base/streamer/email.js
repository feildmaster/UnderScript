import eventManager from 'src/utils/eventManager.js';
import * as $el from 'src/utils/elementHelper.js';
import streaming from './0.streamer.js';

eventManager.on(':preload:Settings', () => {
  if (!streaming()) return;
  $el.text.contains(document.querySelectorAll('p'), 'Mail :').forEach((e) => {
    // TODO: translation?
    e.innerText = 'Mail : <hidden>';
  });
});
