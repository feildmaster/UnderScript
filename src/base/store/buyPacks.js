import eventManager from '../../utils/eventManager';
import { global, globalSet } from '../../utils/global';
import * as hover from '../../utils/hover';
import wrap from '../../utils/2.pokemon';
import sleep from '../../utils/sleep';
import * as api from '../../utils/4.api';

wrap(() => {
  // buy multiple packs
  function buyPacks({
    type, count, gold,
  }) {
    if (gold) { // Gold error checking
      const g = parseInt($('#golds').text(), 10);
      if (g < 100 * count) {
        throw new Error('Not enough Gold');
      }
    } else { // UCP error checking
      const ucp = parseInt($('#ucp').text(), 10);
      if (ucp < 10 * count) {
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

  function getCount(e, cost) {
    if (e.ctrlKey) return Math.floor(parseInt($(cost ? '#ucp' : '#golds').text(), 10) / (cost ? 10 : 100));
    if (e.altKey) return 10;
    return 1;
  }

  eventManager.on(':loaded:Packs', () => {
    const types = ['', 'DR'];

    types.forEach((type) => {
      ['', 'Ucp'].forEach((cost) => {
        const el = document.querySelector(`#btn${cost}${type}Add`);
        el.onclick = null;
        el.addEventListener('click', (e) => {
          const count = getCount(e, cost);
          if (!count) return;
          const data = {
            count,
            type,
            gold: !cost,
          };
          if (cost && !e.shiftKey) {
            global('BootstrapDialog').show({
              title: 'Buy packs with UCP?',
              message: $.i18n(`Buy ${count} pack${count > 1 ? 's' : ''} for {{UCP:${count * 10}}} UCP?`),
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
      if (Number.isNaN(count)) throw new Error(`Count(${count}) must be a number`);
      buyPacks({
        type,
        count,
        gold: !!gold,
      });
    });
  });
});
