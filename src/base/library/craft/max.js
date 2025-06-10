import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import sleep from 'src/utils/sleep.js';
import onPage from 'src/utils/onPage.js';
import * as hover from 'src/utils/hover.js';
import * as cardHelper from 'src/utils/cardHelper.js';
import Translation from 'src/structures/constants/translation.js';
import setBypass from './protection.js';

const setting = settings.register({
  name: Translation.Setting('craft.hotkey'),
  key: 'underscript.disable.craftMax',
  category: Translation.CATEGORY_LIBRARY_CRAFTING,
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
    const amount = cardHelper.quantity(el);
    if (amount >= max) return;
    const cost = cardHelper.dustCost(el);
    const total = cardHelper.totalDust();
    if (cost > total) {
      // TODO: translation
      card.hover(hover.show('CTRL Click: insufficient dust'));
      return;
    }
    // TODO: translation
    card.hover(hover.show(`CTRL Click: Craft up to max(${max})`))
      .off('click')
      .on('click.script', (e) => {
        const id = parseInt(card.attr('id'), 10);
        const shiny = card.hasClass('shiny');
        if (e.ctrlKey) {
          hover.hide();
          const count = max - cardHelper.quantity(el);
          if (count <= 0) return;
          craftCards(id, shiny, count, cost, total);
        } else {
          global('action')(id, shiny);
        }
      });
  }

  let crafting = false;
  function craftCards(id, shiny, count, cost, total) {
    if (crafting) return;
    crafting = true;
    setBypass(true);
    const craft = global('craft');
    let dust = total;
    let remaining = count;
    do {
      dust -= cost;
      craft(id, shiny);
      remaining -= 1;
    } while (remaining && dust >= cost);
    sleep(1000).then(() => { // Wait a second before allowing crafting again
      calculate(); // Re-calculate after crafting
      crafting = false;
      setBypass(false);
    });
  }
});
