import eventManager from '../../utils/eventManager.js';
import { global } from '../../utils/global.js';

eventManager.on('Chat:Disconnected', () => {
  $('.chat-box').each((i, e) => {
    global('scroll')($(e), true);
  });
});
