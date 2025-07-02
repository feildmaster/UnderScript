import eventManager from 'src/utils/eventManager.js';
import { global, globalSet } from 'src/utils/global.js';
import * as hover from 'src/utils/hover.js';
import wrap from 'src/utils/2.pokemon.js';
import sleep from 'src/utils/sleep.js';
import * as api from 'src/utils/4.api.js';
import Translation from 'src/structures/constants/translation.ts';
import { getTranslationArray } from '../underscript/translation.js';

wrap(() => {
  // buy multiple packs
  function buyPacks({
    type, count, gold,
  }) {
    const rawCost = document.querySelector(`#btn${gold ? '' : 'Ucp'}${type}Add`).nextElementSibling.textContent;
    const cost = Number(rawCost);
    if (gold) { // Gold error checking
      const g = parseInt($('#golds').text(), 10);
      if (g < cost * count) {
        throw new Error('Not enough Gold');
      }
    } else { // UCP error checking
      const ucp = parseInt($('#ucp').text(), 10);
      if (ucp < cost * count) {
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
    if (e.ctrlKey) return Math.floor(parseInt($(cost ? '#ucp' : '#golds').text(), 10) / baseCost);
    if (e.altKey) return 10;
    return 1;
  }

  eventManager.on(':preload:Packs', () => {
    const types = ['', 'DR', 'UTY'];

    types.forEach((type) => {
      ['', 'Ucp'].forEach((cost) => {
        const el = document.querySelector(`#btn${cost}${type}Add`);
        if (!el) return;
        el.onclick = null;
        el.addEventListener('click', (e) => {
          const price = Number(el.nextElementSibling.textContent);
          const count = getCount(e, cost, price);
          if (!count) return;
          const data = {
            count,
            type,
            gold: !cost,
          };
          if (cost && !e.shiftKey) {
            global('BootstrapDialog').show({
              title: `${Translation.PURCHASE}`,
              message: Translation.General('purchase.pack.cost').translate(count, count * price),
              buttons: [{
                label: `${Translation.CONTINUE}`,
                cssClass: 'btn-success',
                action(diag) {
                  buyPacks(data);
                  diag.close();
                },
              }, {
                label: `${Translation.CANCEL}`,
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
        eventManager.on('underscript:ready', () => {
          const { key } = Translation.General('purchase.pack.note');
          const array = [...getTranslationArray(key)];
          if (cost) {
            array.push(Translation.General('bypass.shift'));
          }
          $(el).hover(hover.show(array.join('<br>')));
        });
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
