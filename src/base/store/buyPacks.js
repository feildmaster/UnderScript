import eventManager from '../../utils/eventManager.js';
import { global, globalSet } from '../../utils/global.js';
import * as hover from '../../utils/hover.js';
import wrap from '../../utils/2.pokemon.js';
import sleep from '../../utils/sleep.js';
import * as api from '../../utils/4.api.js';

wrap(() => {
  // buy multiple packs
  function buyPacks({
    type, count, gold,
  }) {
    if (gold) { // Gold error checking
      const goldCost = type === 'UTY' ? 200 : 100;
      const g = parseInt($('#golds').text(), 10);
      if (g < goldCost * count) {
        throw new Error('Not enough Gold');
      }
    } else { // UCP error checking
      const ucpCost = type === 'UTY' ? 20 : 10;
      const ucp = parseInt($('#ucp').text(), 10);
      if (ucp < ucpCost * count) {
        throw new Error('Not enough UCP');
      }
    }
    $.fx.off = true;
    const addPack = global('addPack');
    for (let i = 0; i < count; i++) {
      sleep(i * 10).then(() => {
        globalSet('canAdd', true);
        addPack(`add${type}Pack${gold ? '' : 'Ucp'}`, true);
      });
    }
    sleep(500).then(() => {
      $.fx.off = false;
    });
  }

  function getCount(e, cost, baseCost) {
    if (e.ctrlKey) return Math.floor(parseInt($(cost ? '#ucp' : '#golds').text(), 10) / (cost ? baseCost / 10 : baseCost));
    if (e.altKey) return 10;
    return 1;
  }

  eventManager.on(':loaded:Packs', () => {
    const types = ['', 'DR', 'UTY'];

    types.forEach((type) => {
      ['', 'Ucp'].forEach((cost) => {
        const el = document.querySelector(`#btn${cost}${type}Add`);
        el.onclick = null;
        el.addEventListener('click', (e) => {
          const price = type === 'UTY' ? 200 : 100;
          const count = getCount(e, cost, price);
          if (!count) return;
          const data = {
            count,
            type,
            gold: !cost,
          };
          if (cost && !e.shiftKey) {
            global('BootstrapDialog').show({
              title: 'Buy packs with UCP?',
              message: $.i18n(`Buy ${count} pack${count > 1 ? 's' : ''} for {{UCP:${count * (price / 10)}}} UCP?`),
              buttons: [{
                label: $.i18n('dialog-continue'),
                cssClass: 'btn-success',
                action(diag) {
                  buyPacks(data);
                  diag.close();
                },
              }, {
                label: $.i18n('dialog-cancel'),
                cssClass: 'btn-danger',
                action(diag) {
                  diag.close();
                },
              }],
            });
          } else {
            buyPacks(data);
          }
        });
        $(el).hover(hover.show(`CTRL: Buy MAX packs<br>ALT: Buy (up to) 10 packs${cost ? '<br>SHIFT: Bypass confirmation' : ''}`));
      });
    });

    api.register('buyPacks', (count, { type = '', gold = true } = {}) => {
      if (!types.includes(type)) throw new Error(`Unsupported Pack: ${type}`);
      if (!Number.isInteger(count) || count < 1) throw new Error(`Count(${count}) must be a number`);
      buyPacks({
        type,
        count,
        gold: !!gold,
      });
    });
  });
});
