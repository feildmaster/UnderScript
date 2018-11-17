settings.register({
  name: 'Disable Quick Opening Packs',
  key: 'underscript.disable.packOpening',
  refresh: () => onPage('Packs'),
});

onPage('Packs', function quickOpenPack() {
  if (settings.value('underscript.disable.packOpening')) return;
  const rarity = [ 'DETERMINATION', 'LEGENDARY', 'EPIC', 'RARE', 'COMMON' ];
  const results = {};
  function clearResults() {
    results.shiny = 0;
    rarity.forEach((key) => results[key] = {});
  }
  function showCards() {
    $('.slot .cardBack').each((i, e) => { show(e, i); });
  }
  clearResults(); // Build once
  let autoOpen = false, openAll = false;
  $(document).ajaxComplete((event, xhr, settings) => {
    const data = JSON.parse(settings.data);
    if (settings.url !== 'PacksConfig' || !['openPack', 'openShinyPack'].includes(data.action) || data.status) return;
    if (openAll !== false) {
      JSON.parse(xhr.responseJSON.cards).forEach((card) => {
        if (!results.hasOwnProperty(card.rarity)) {
          console.error(`You're a dumbass feildmaster`);
          results[card.rarity] = {};
        }
        const rarity = results[card.rarity];
        rarity[card.name] = (rarity[card.name] || 0) + 1;
        if (card.shiny && data.action === 'openPack') {
          results.shiny += 1;
        }
      });
      openAll -= 1;
      if (openAll === 0) {
        openAll = false;
        let text = '';
        let total = 0;
        // Magic numbers, yep. Have between 6...26 cards showing
        let limit = Math.min(Math.max(Math.floor(window.innerHeight / 38), 6), 26);
        // Increase the limit if we don't have a specific rarity
        rarity.forEach((key) => {
          if (!Object.keys(results[key]).length) {
            limit += 1;
          }
        });

        // Display results
        rarity.forEach((key) => {
          const keys = Object.keys(results[key]);
          if (!keys.length) return;
          const buffer = [];
          let count = 0;
          keys.forEach((name) => {
            const cardCount = results[key][name];
            count += cardCount;
            if (limit) {
              limit -= 1;
              buffer.push(`${name}${cardCount > 1 ? ` (${cardCount})` : ''}${limit ? '' : '...'}`);
            }
          });
          total += count;
          text += `${key} (${count}):${buffer.length ? `\n- ${buffer.join('\n- ')}` : ' ...'}\n`;
        });
        fn.toast({
          text,
          title: `Pack Results (${total}${results.shiny ? `, ${results.shiny} shiny` : ''}):`,
          css: {'font-family': 'inherit'},
        });
        showCards();
      }
    } else if (autoOpen) {
      showCards();
    }
  });
  $('#btnOpen, #btnOpenShiny').on('click.script', (event) => {
    autoOpen = event.ctrlKey;
    openAll = false;
    const shiny = $(event.target).prop('id') === 'btnOpenShiny' ? 'Shiny' : '';
    const count = parseInt($(`#nb${shiny}Packs`).text());
    if (event.shiftKey) {
      clearResults();
      openAll = count;
      for (let i = 1; i < count; i++) { // Start at 1, we've "opened" a pack already
        canOpen = true;
        openPack(`open${shiny}Pack`);
      }
      hover.hide();
    } else if (count === 1) { // Last pack?
      hover.hide();
    }
  }).on('mouseenter.script', hover.show(`<span style="font-style: italic;">
      * CTRL Click to auto reveal one pack<br />
      * Shift Click to auto open ALL packs
    </span>`)).on('mouseleave.script', hover.hide);
});
