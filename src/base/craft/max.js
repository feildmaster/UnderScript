import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global } from '../../utils/global';
import sleep from '../../utils/sleep';
import onPage from '../../utils/onPage';
import * as hover from '../../utils/hover';
import * as cardHelper from '../../utils/cardHelper';

const setting = settings.register({
  name: 'Disable craft max hotkey',
  key: 'underscript.disable.craftMax',
  category: 'Crafting',
  onChange() {
    eventManager.emit('refreshhighlight');
  },
  page: 'Library',
});

onPage('Crafting', function craftMax() {
  eventManager.on('refreshhighlight', calculate);

  function calculate() {
    hover.hide();
    document.querySelectorAll('div.card, table.cardBoard, table.card').forEach(checkCard);
  }

  function checkCard(el) {
    const card = $(el);
    card.off('hover');
    if (setting.value()) return;
    const rarity = cardHelper.rarity(el);
    if (rarity === 'DETERMINATION') return;
    const max = cardHelper.max(rarity);
    const limit = max - cardHelper.quantity(el);
    if (limit <= 0) return;
    const cost = cardHelper.dustCost(el);
    const total = cardHelper.totalDust();
    if (cost > total) return;
    card.hover(hover.show(`CTRL Click: Craft up to max(${max})`))
      .off('click')
      .on('click.script', (e) => {
        const id = parseInt(card.attr('id'), 10);
        const shiny = card.hasClass('shiny');
        if (e.ctrlKey) {
          hover.hide();
          const l = max - cardHelper.quantity(el);
          if (l <= 0) return;
          craftCards(id, shiny, l, cost, total);
        } else {
          global('action')(id, shiny);
        }
      });
  }

  let crafting = false;
  function craftCards(id, shiny, count, cost, total) {
    if (crafting) return;
    crafting = true;
    const craft = global('craft');
    do {
      total -= cost;
      craft(id, shiny);
    } while (--count && total >= cost); // eslint-disable-line no-plusplus
    sleep(1000).then(() => { // Wait a second before allowing crafting again
      calculate(); // Re-calculate after crafting
      crafting = false;
    });
  }
});
