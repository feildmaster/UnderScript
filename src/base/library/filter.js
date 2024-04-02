import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global, globalSet } from '../../utils/global.js';
import style from '../../utils/style.js';
import onPage from '../../utils/onPage.js';

const crafting = onPage('Crafting');
const decks = onPage('Decks');

const base = {
  onChange: () => applyLook(),
  category: 'Filter',
  page: 'Library',
};

const setting = settings.register({
  ...base,
  name: 'Disable filter',
  key: 'underscript.deck.filter.disable',
});

const splitBaseGen = settings.register({
  ...base,
  name: 'Split Based and Token',
  key: 'underscript.deck.filter.split',
  default: true,
});

const tribe = settings.register({
  ...base,
  name: 'Tribe button',
  key: 'underscript.deck.filter.tribe',
});

const shiny = settings.register({
  ...base,
  name: 'Merge Shiny Cards',
  key: 'underscript.deck.filter.shiny',
  options: ['Never (default)', 'Deck', 'Always'],
  default: 'Deck',
});

style.add(
  '.filter input+* {  opacity: 0.4; }',
  '.filter input:checked+* {  opacity: 1; }',
  '.filter input:disabled, .filter input:disabled+* { display: none; }',
);

function applyLook(refresh = decks || crafting) {
  $('input[onchange^="applyFilters();"]').parent().parent().toggleClass('filter', !setting.value());
  if (crafting) {
    if (!setting.value() && splitBaseGen.value() && !$('#baseRarityInput').length) {
      // Add BASE
      $('#commonRarityInput').parent().before(createButton('BASE'), ' ');
      $('#baseGenInput').prop('checked', true).prop('disabled', true).parent()
        .after(createButton('TOKEN'));
    } else if (setting.value() || !splitBaseGen.value()) {
      $('#baseGenInput').prop('checked', false).prop('disabled', false);
      $('.customInput.rarityInput').parent().remove();
    }
  }

  // Tribe filter
  if (tribe.value() && !$('#allTribeInput').length) {
    $('#monsterInput').parent().before(createTribeButton(), ' ');
  }
  $('#allTribeInput').prop('disabled', !tribe.value());

  $('#shinyInput').prop('disabled', mergeShiny());
  if (refresh) {
    global('applyFilters')();
    global('showPage')(0);
  }
}

eventManager.on(':loaded:Decks :loaded:Crafting', () => {
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
      if (card.rarity === 'TOKEN' && !$('#tokenRarityInput').prop('checked')) {
        return true;
      }
    }
    // Rarity
    // Type
    // Tribe
    if (!removed && tribe.value()) {
      if ($('#allTribeInput').prop('checked')) {
        return !card.tribes.length;
      }
    }
    // Search
    // Owned/Unowned
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

function createButton(type) {
  return $(`
  <label>
    <input type="checkbox" id="${type.toLowerCase()}RarityInput" class="rarityInput customInput" rarity="${type}" onchange="applyFilters(); showPage(0);">
    <img src="images/rarity/BASE_${type}.png">
  </label>`);
}

function createTribeButton(type = 'ALL') {
  return $(`
  <label>
    <input type="checkbox" id="${type.toLowerCase()}TribeInput" class="tribeInput customInput" onchange="applyFilters(); showPage(0);">
    <img src="images/tribes/${type}.png">
  </label>`);
}
