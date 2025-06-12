import { cardName } from 'src/utils/cardHelper';
import eventManager from 'src/utils/eventManager.js';
import { global, globalSet } from 'src/utils/global.js';
import onPage from 'src/utils/onPage.js';

onPage('Crafting', () => {
  eventManager.on('jQuery', () => {
    $(document).ajaxComplete((event, xhr, options) => {
      if (options.url !== 'CraftConfig') return;
      if (!options.data) {
        eventManager.emit('Craft:Loaded');
        return;
      }
      const data = JSON.parse(options.data);
      const response = xhr.responseJSON;
      const success = response.status === 'success';
      if (data.action === 'craft') {
        if (success) {
          const card = response.card ? JSON.parse(response.card) : {};
          const id = card.id || response.cardId;
          eventManager.emit('craftcard', {
            id,
            name: cardName(card) || response.cardName,
            dust: response.dust,
            shiny: data.isShiny || response.shiny || false,
          });
        } else {
          eventManager.emit('crafterrror', response.message, response.status);
        }
      } else {
        eventManager.emit(`Craft:${data.action}`, success, response, data);
      }
    });
  });

  eventManager.on(':preload', () => {
    globalSet('showPage', function showPage(...args) {
      const prevPage = global('currentPage');
      this.super(...args);
      eventManager.emit('Craft:RefreshPage', global('currentPage'), prevPage);
    });
  });
});
