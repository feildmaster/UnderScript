settings.register({
  name: 'Disable Crafting Highlight',
  key: 'underscript.disable.craftingborder',
  onChange: () => {
    if (onPage('Crafting')) {
      setTimeout(() => eventManager.emit('refreshhighlight'));
    }
  },
});

onPage('Crafting', function craftableCards() {
  style.add(
    '.craftable { box-shadow: 0 0 10px 2px #008000; transform: translate3d(0,0,0); }',
    '.craftable td { border-color: #00cc00; }',
    '.highlight-green { text-shadow: 0px 0px 10px #008000; color: #00cc00; }',
  );

  function highlight(el) {
    const rarity = cardHelper.rarity(el);
    const set = !settings.value('underscript.disable.craftingborder') &&
        rarity !== 'DETERMINATION' &&
        cardHelper.craft.quantity(el) < cardHelper.craft.max(rarity) &&
        cardHelper.craft.cost(el) <= cardHelper.craft.totalDust();
    el.classList.toggle('craftable', set);
  }

  function update({id, shiny, dust}) {
    if (dust >= cardHelper.craft.cost('LEGENDARY', true)) {
      debug('updating');
      highlight(cardHelper.find(id, shiny));
    } else {
      highlightCards();
    }
  }

  function highlightCards() {
    debug('highlighting');
    document.querySelectorAll('table.cardBoard, table.card').forEach(highlight);
  }

  eventManager.on('craftcard', update);
  eventManager.on('refreshhighlight', highlightCards);
  eventManager.on('Craft:RefreshPage', () => eventManager.emit('refreshhighlight'));

  fn.infoToast('Craftable cards are highlighted in <span class="highlight-green">green</span>', 'underscript.notice.craftingborder', '1')
});