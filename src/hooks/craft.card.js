import eventManager from '../utils/eventManager';
import { global, globalSet } from '../utils/global';
import onPage from '../utils/onPage';

onPage('Crafting', () => {
  eventManager.on('jQuery', () => {
    $(document).ajaxComplete((event, xhr, options) => {
      if (options.url !== 'CraftConfig') return;
      if (!options.data) {
        eventManager.emit('Craft:Loaded');
        return;
      }
      const data = JSON.parse(options.data);
      const r = xhr.responseJSON;
      const success = r.status === 'success';
      if (data.action === 'craft') {
        if (success) {
          const card = r.card ? JSON.parse(r.card) : {};
          const id = card.id || r.cardId;
          eventManager.emit('craftcard', {
            id,
            name: card.name || $.i18n(`card-name-${id}`) || r.cardName,
            dust: r.dust,
            shiny: data.isShiny || r.shiny || false,
          });
        }
      } else if (data.action === 'disenchant') {
        // TODO
      } else if (data.action === 'auto') {
        // TODO
      }
    });
  });

  eventManager.on(':loaded', () => {
    globalSet('showPage', function showPage(...args) {
      const prevPage = global('currentPage');
      this.super(...args);
      eventManager.emit('Craft:RefreshPage', {
        page: global('currentPage'),
        prev: prevPage,
      });
    });
  });
});
