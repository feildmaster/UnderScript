wrap(() => {
  eventManager.on(':loaded:Friendship', () => {
    eventManager.emit('Friendship:load');
    $(document).ajaxComplete((event, xhr, settings) => {
      if (settings.url !== 'FriendshipConfig') return;
      if (settings.type === 'GET') {
        eventManager.emit('Friendship:loaded');
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
            reward,
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
});
