settings.register({
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
    if (settings.value('underscript.disable.craftMax')) return;
    const rarity = cardHelper.rarity(el);
    const max = cardHelper.craft.max(rarity);
    if (rarity === 'DETERMINATION') return;
    const limit = max - cardHelper.craft.quantity(el);
    if (limit <= 0) return;
    const cost = cardHelper.craft.cost(el);
    const total = cardHelper.craft.totalDust();
    if (cost > total) return;
    const card = $(el);
    card.hover(hover.show(`CTRL Click: Craft up to max(${max})`))
      .off('click')
      .on('click.script', (e) => {
        const id = parseInt(card.attr('id'), 10);
        const shiny = card.hasClass('shiny');
        if (e.ctrlKey) {
          hover.hide();
          craftCards(id, shiny, limit, cost, total);
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
    crafting = false;
  }
});
