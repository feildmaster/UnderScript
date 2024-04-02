import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global, globalSet } from '../../utils/global.js';
import style from '../../utils/style.js';
import onPage from '../../utils/onPage.js';

export const crafting = onPage('Crafting');
export const decks = onPage('Decks');
export const filters = [
  function templateFilter(card, removed = false) {
    return removed;
  },
];

const base = {
  onChange: () => applyLook(),
  category: 'Filter',
  page: 'Library',
  default: true,
};

const setting = settings.register({
  ...base,
  default: false,
  name: 'Disable filter',
  key: 'underscript.deck.filter.disable',
});

const splitBaseGen = settings.register({
  ...base,
  name: 'Split Based and Token',
  key: 'underscript.deck.filter.split',
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
      $('.rarityInput.custom').parent().remove();
    }
  }

  // Tribe filter
  if (!setting.value() && tribe.value() && !$('#allTribeInput').length) {
    $('#monsterInput').parent().before(allTribeButton(), ' ');
  } else if (setting.value()) {
    $('#allTribeInput').parent().remove();
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
    if (setting.value()) return this.super(card);
    return filters.reduce((removed, func) => {
      const val = func.call(this, card, removed);
      if (typeof val === 'boolean') {
        return val;
      }
      return removed;
    }, false);
  });
});

function mergeShiny() {
  return shiny.value() === 'Always' || (decks && shiny.value() === 'Deck');
}

function createButton(type) {
  return $(`
  <label>
    <input type="checkbox" id="${type.toLowerCase()}RarityInput" class="rarityInput custom" rarity="${type}" onchange="applyFilters(); showPage(0);">
    <img src="images/rarity/BASE_${type}.png">
  </label>`);
}

function allTribeButton() {
  return $(`
  <label>
    <input type="checkbox" id="allTribeInput" onchange="applyFilters(); showPage(0);">
    <img src="images/tribes/ALL.png">
  </label>`);
}

filters.push(
  function basicFilter(card) {
    // Rarity, Type, Extension, Search
    return this.super(card);
  },
  function shinyFilter(card, removed) {
    if (removed && mergeShiny()) {
      return this.super({
        ...card,
        shiny: !card.shiny,
      });
    }
    return removed;
  },
  function baseGenFilter(card, removed) {
    if (!removed && crafting && splitBaseGen.value()) {
      if (card.rarity === 'BASE' && !card.shiny && !$('#baseRarityInput').prop('checked')) {
        return true;
      }
      if (card.rarity === 'TOKEN' && !$('#tokenRarityInput').prop('checked')) {
        return true;
      }
    }
    return removed;
  },
  function tribeFilter(card, removed) {
    if (!removed && tribe.value() && $('#allTribeInput').prop('checked')) {
      return !card.tribes.length;
    }
    return removed;
  },
  function searchFilter(card, removed) { // Custom keywords
    return removed;
  },
  function unownedFilter(card, removed) { // Crafting only
    return removed;
  },
);
