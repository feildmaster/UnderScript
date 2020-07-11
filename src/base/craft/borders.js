settings.register({
  name: 'Disable Crafting Highlight',
  key: 'underscript.disable.craftingborder',
  onChange: () => {
    if (onPage('Crafting')) {
      sleep().then(() => eventManager.emit('refreshhighlight'));
    }
  },
  category: 'Crafting',
  page: 'Library',
});

onPage('Crafting', function craftableCards() {
  style.add(
    '.craftable .cardFrame { -webkit-filter: grayscale(100%) brightness(45%) sepia(100%) hue-rotate(80deg) saturate(400%) contrast(1.5); filter: grayscale(100%) brightness(45%) sepia(100%) hue-rotate(80deg) saturate(400%) contrast(1.5); }',
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

  function update({ id, shiny, dust }) {
    if (dust >= cardHelper.craft.cost('LEGENDARY', true)) {
      debug('updating');
      const el = cardHelper.find(id, shiny);
      if (el) highlight(el);
      else debug({ id, shiny }, 'underscript.debugging.borders');
    } else {
      highlightCards();
    }
  }

  function highlightCards() {
    debug('highlighting');
    document.querySelectorAll('div.card, table.cardBoard, table.card').forEach(highlight);
  }

  eventManager.on('craftcard', update);
  eventManager.on('refreshhighlight', highlightCards);
  eventManager.on('Craft:RefreshPage', () => eventManager.emit('refreshhighlight'));

  fn.infoToast('Craftable cards are highlighted in <span class="highlight-green">green</span>', 'underscript.notice.craftingborder', '1');
});
