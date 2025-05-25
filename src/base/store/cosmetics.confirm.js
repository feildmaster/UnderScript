import eventManager from 'src/utils/eventManager.js';
import { global } from 'src/utils/global.js';
import * as hover from 'src/utils/hover.js';
import wrap from 'src/utils/2.pokemon.js';

wrap(() => {
  eventManager.on(':preload:CosmeticsShop', () => {
    $('form[action=CosmeticsShop] button')
      .hover(hover.show('Shift: Bypass confirmation'), hover.hide)
      .click(function click(e) {
        if (e.shiftKey) return;
        e.preventDefault();
        const form = $(e.currentTarget).parent();
        const parent = getParent(form);
        const image = parent.find('img')[0]?.outerHTML || '[Failed to detect image]';
        const cost = parent.find('span[class=ucp]:first').text();
        global('BootstrapDialog').show({
          title: 'Buy with UCP?',
          message: `<div style="overflow: hidden;">${image}</div>${$.i18n(` Buy for {{UCP:${cost}}} UCP?`)}`,
          buttons: [{
            label: $.i18n('dialog-continue'),
            cssClass: 'btn-success',
            action(diag) {
              form.submit();
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
      });
  });
});

function getParent(form) {
  const table = $(form.parents('table, div')[0]);
  if (table.find('img').length) {
    return table;
  }
  return table.parent().parent();
}
