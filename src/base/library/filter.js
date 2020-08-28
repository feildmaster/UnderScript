wrap(function filter() {
  const crafting = onPage('Crafting');
  const decks = onPage('Decks');

  const setting = settings.register({
    name: 'Disable filter',
    key: 'underscript.deck.filter.disable',
    onChange: applyLook,
    category: 'Filter',
    page: 'Library',
  });
  const splitBaseGen = settings.register({
    name: 'Split Based and Generated',
    key: 'underscript.deck.filter.split',
    default: true,
    onChange: applyLook,
    category: 'Filter',
    page: 'Library',
  });

  const shiny = settings.register({
    name: 'Merge Shiny Cards',
    key: 'underscript.deck.filter.shiny',
    options: ['Never (default)', 'Deck', 'Always'],
    onChange: applyLook,
    category: 'Filter',
    page: 'Library',
  });

  if (!(decks || crafting)) return;
  style.add(
    // '.filter input { display: none; }',
    '.filter input+* {  opacity: 0.4; }',
    '.filter input:checked+* {  opacity: 1; }',
    '.filter #baseGenInput, .filter #baseGenInput:disabled+* { display: none; }',
    '.filter #shinyInput:disabled, .filter #shinyInput:disabled+* { display: none; }',
  );

  function applyLook(refresh = true) {
    function createButton(type) {
      return $(`<label>
        <input type="checkbox" id="${type.toLowerCase()}RarityInput" class="rarityInput customRarityInput"
        rarity="${type}" onchange="applyFilters(); showPage(0);">
        <img src="images/rarity/BASE_${type}.png">
      </label>`);
    }
    $('input[onchange^="applyFilters();"]').parent().parent().toggleClass('filter', !setting.value());
    if (crafting) {
      if (!setting.value() && splitBaseGen.value() && !$('#baseRarityInput').length) {
        // Add BASE
        $('#commonRarityInput').parent().before(createButton('BASE'), ' ');
        // GENERATED
        $('#baseGenInput').prop('checked', true).prop('disabled', true).parent()
          .after(createButton('GENERATED'));
      } else if (setting.value() || !splitBaseGen.value()) {
        $('#baseGenInput').prop('checked', false).prop('disabled', false);
        $('.customRarityInput').parent().remove();
      }
    }

    $('#shinyInput').prop('disabled', mergeShiny());
    if (refresh) {
      global('applyFilters')();
      global('showPage')(0);
    }
  }

  eventManager.on(':loaded', () => {
    // Update filter visuals
    applyLook(false);
    globalSet('isRemoved', function newFilter(card) {
      let removed = this.super(card);
      if (setting.value()) return removed;
      // Shiny - This works, is ugly
      if (removed && mergeShiny()) {
        card.shiny = !card.shiny;
        removed = this.super(card); // If it would still hide, fine.
        card.shiny = !card.shiny;
      }
      // Show base/gen if relevant
      if (!removed && splitGenerated()) {
        if (card.rarity === 'BASE' && !card.shiny && !$('#baseRarityInput').prop('checked')) {
          return true;
        }
        if (card.rarity === 'GENERATED' && !$('#generatedRarityInput').prop('checked')) {
          return true;
        }
      }
      // Rarity
      // Type
      // Family
      // Search
      // fall back for now
      return removed;
    });
  });

  function mergeShiny() {
    return shiny.value() === 'Always' || (decks && shiny.value() === 'Deck');
  }

  function splitGenerated() {
    return crafting && splitBaseGen.value();
  }
});
