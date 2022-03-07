import eventManager from '../../utils/eventManager';
import { global } from '../../utils/global';

eventManager.on('ChatDetected', () => {
  const socketChat = global('socketChat');
  const oClose = socketChat.onclose;
  socketChat.onclose = () => {
    oClose();
    $('.chat-box').each((i, e) => {
      global('scroll')($(e), true);
    });
  };
});
