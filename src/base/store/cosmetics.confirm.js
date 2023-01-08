import eventManager from '../../utils/eventManager.js';
import { global } from '../../utils/global.js';
import * as hover from '../../utils/hover.js';
import wrap from '../../utils/2.pokemon.js';

wrap(() => {
  eventManager.on(':loaded:CosmeticsShop', () => {
    $('form[action=CosmeticsShop] button')
      .hover(hover.show('Shift: Bypass confirmation'), hover.hide)
      .click(function click(e) {
        if (e.shiftKey) return;
        e.preventDefault();
        const form = $(e.currentTarget).parent();
        const parent = $(form.parents('table.table-condensed, div')[0]);
        const image = parent.find('img')[0].outerHTML;
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
