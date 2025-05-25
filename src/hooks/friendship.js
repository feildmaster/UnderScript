import Item from 'src/structures/constants/item.js';
import eventManager from 'src/utils/eventManager.js';
import { global } from 'src/utils/global.js';

eventManager.on(':preload:Friendship', () => {
  eventManager.singleton.emit('Friendship:load');
  $(document).ajaxComplete((event, xhr, settings) => {
    if (settings.url !== 'FriendshipConfig') return;
    if (settings.type === 'GET') {
      eventManager.singleton.emit('Friendship:loaded');
    } else if (xhr.responseJSON) {
      const data = xhr.responseJSON;
      if (data.status === 'success') {
        const {
          idCard,
          reward, // GOLD, UCP, PACK, DR_PACK
          quantity,
          claim,
        } = data;

        eventManager.emit('Friendship:claim', {
          data: global('friendshipItems')[idCard],
          reward: Item.find(reward) || reward,
          quantity,
          claim,
        });
      } else if (data.status === 'errorMaintenance') {
        eventManager.emit('Friendship:claim', {
          error: JSON.parse(data.message),
        });
      }
    } else {
      eventManager.emit('Friendship:claim', {
        error: true,
      });
    }
  });

  eventManager.on('ShowPage', (page) => eventManager.emit('Friendship:page', page));
});
