import eventManager from '../../utils/eventManager';
import streaming from './0.streamer';
import * as $el from '../../utils/elementHelper';

eventManager.on(':loaded:Settings', () => {
  if (!streaming()) return;
  $el.text.contains(document.querySelectorAll('p'), 'Mail :').forEach((e) => {
    e.innerText = 'Mail : <hidden>';
  });
});
