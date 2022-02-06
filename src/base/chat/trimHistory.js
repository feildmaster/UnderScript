import eventManager from '../../utils/eventManager';
import { global } from '../../utils/global';

eventManager.on('Chat:getMessage', (data) => {
  if (!data.idRoom) return;

  const history = global('publicChats')[data.idRoom];

  if (Array.isArray(history) && history.length > 50) {
    history.splice(0, history.length - 50);
  }
});
