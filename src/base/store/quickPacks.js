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
    results.packs = 0;
    results.shiny = 0;
    rarity.forEach((key) => results[key] = {});
  }
  
  let autoOpen = false, openAll = false, left = 0;

  eventManager.on('jQuery', () => {
    function showCards() {
      const show = global('revealCard', 'show');
      $('.slot .cardBack').each((i, e) => { show(e, i); });
    }
    clearResults(); // Build once
    $(document).ajaxComplete((event, xhr, settings) => {
      if (settings.url !== 'PacksConfig' || !settings.data) return;
      const data = JSON.parse(settings.data);
      if (data.status || xhr.responseJSON.action !== 'getCards') return;
      if (openingPacks()) {
        results.packs += 1;
        JSON.parse(xhr.responseJSON.cards).forEach((card) => {
          const result = results[card.rarity] = results[card.rarity] || {};
          const c = result[card.name] = result[card.name] || { total:0, shiny:0 }
          c.total += 1;
          if (card.shiny) {
            if (data.action !== 'openShinyPack') {
              results.shiny += 1;
            }
            c.shiny += 1;
          }
        });
        openAll -= 1;
        if (openAll === 0) {
          $(`#nb${data.action.substring(4, data.action.length - 4)}Packs`).text(left);
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
            let shiny = 0;
            keys.forEach((name) => {
              const card = results[key][name];
              count += card.total;
              shiny += card.shiny;
              if (limit) {
                limit -= 1;
                buffer.push(`${card.shiny?'<span class="yellow">S</span> ':''}${name}${card.total > 1 ? ` (${card.total}${card.shiny?'':''})` : ''}${limit ? '' : '...'}`);
              }
            });
            total += count;
            text += `${key} (${count}${shiny?`, ${shiny} shiny`:''}):${buffer.length ? `\n- ${buffer.join('\n- ')}` : ' ...'}\n`;
          });
          fn.toast({
            text,
            title: `Results: ${results.packs} Packs${results.shiny?` (${total%4?`${total}, `:''}${results.shiny} shiny)`:total%4?` (${total})`:''}`,
            css: {'font-family': 'inherit'},
          });
          showCards();
        }
      } else if (autoOpen) {
        showCards();
      }
    });
    $('[id^="btnOpen"]').on('click.script', (event) => {
      autoOpen = event.ctrlKey;
      openAll = false;
      const type = $(event.target).prop('id').substring(7);
      const count = parseInt($(`#nb${type}Packs`).text());
      if (event.shiftKey) {
        openPacks(type, count, 1);
        hover.hide();
      } else if (count === 1) { // Last pack?
        hover.hide();
      }
    }).on('mouseenter.script', hover.show(`<span style="font-style: italic;">
        * CTRL Click to auto reveal one pack<br />
        * Shift Click to auto open ALL packs
      </span>`)).on('mouseleave.script', hover.hide);
  });

  function openingPacks() {
    return openAll !== false;
  }

  function openPacks(type, count, start = 0) {
    if (openingPacks()) return;
    const packs = parseInt($(`#nb${type}Packs`).text());
    count = Math.max(Math.min(count, packs), 0);
    if (count === 0) return;
    clearResults();
    left = packs - count;
    openAll = count;
    open(`open${type}Pack`, count - start, count > 1000 ? 5 : 10);
  }

  function open(pack, count, step) {
    const openPack = global('openPack');
    const amt = Math.min(step, count);
    for (let i = 0; i < amt; i++) {
      globalSet('canOpen', true);
      openPack(pack);
    }
    if (count > step) {
      setTimeout(open, 10, pack, count - step)
    }
  }

  const types = ['', 'DR', 'Shiny', 'Super', 'Final'];
  api.register('openPacks', (count, type = '') => {
    if (openingPacks()) throw new Error('Currently opening packs');
    if (!types.includes(type)) throw new Error(`Unsupported Pack: ${type}`);
    openPacks(type, count);
  });

  api.register('openingPacks', openingPacks);
});
