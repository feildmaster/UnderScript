import eventManager from 'src/utils/eventManager.js';
import * as hover from 'src/utils/hover.js';
import wrap from 'src/utils/2.pokemon.js';
import Translation from 'src/structures/constants/translation.ts';

wrap(() => {
  eventManager.on(':preload:CosmeticsShop', () => {
    $('form[action=CosmeticsShop] button')
      .hover(hover.show(Translation.General('bypass.shift')), hover.hide)
      .click(function click(e) {
        if (e.shiftKey) return;
        e.preventDefault();
        const form = $(e.currentTarget).parent();
        const parent = getParent(form);
        const image = parent.find('img')[0]?.outerHTML || '[Failed to detect image]';
        const cost = parent.find('span[class=ucp]:first').text();
        BootstrapDialog.show({
          title: `${Translation.PURCHASE}`,
          message: `<div style="overflow: hidden;">${image}</div> ${
            Translation.General('purchase.item.cost').translate(cost)
          }`,
          buttons: [{
            label: `${Translation.CONTINUE}`,
            cssClass: 'btn-success',
            action(diag) {
              form.submit();
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
