import eventManager from 'src/utils/eventManager.js';
import { global } from 'src/utils/global.js';

eventManager.on('Chat:Disconnected', () => {
  $('.chat-box').each((i, e) => {
    global('scroll')($(e), true);
  });
});
