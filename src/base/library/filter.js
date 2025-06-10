import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global, globalSet } from 'src/utils/global.js';
import style from 'src/utils/style.js';
import onPage from 'src/utils/onPage.js';
import { translateText } from 'src/utils/translate.js';
import { max } from 'src/utils/cardHelper.js';

export const crafting = onPage('Crafting');
export const decks = onPage('Decks');
export const filters = [
  /**
   * @param {Card} card
   * @param {boolean} removed
   * @returns {boolean | undefined}
   */
  function templateFilter(card, removed) {
    return removed;
  },
];

filters.shift(); // Remove template

const base = {
  onChange: () => applyLook(),
  category: 'Filter',
  page: 'Library',
  default: true,
};

const setting = settings.register({
  ...base,
  default: false,
  // TODO: translation
  name: 'Disable filter',
  key: 'underscript.deck.filter.disable',
});

const splitBaseGen = settings.register({
  ...base,
  // TODO: translation
  name: 'Split Based and Token',
  key: 'underscript.deck.filter.split',
});

const tribe = settings.register({
  ...base,
  // TODO: translation
  name: 'Tribe button',
  key: 'underscript.deck.filter.tribe',
});

const owned = settings.register({
  ...base,
  // TODO: translation
  name: 'Collection dropdown',
  key: 'underscript.deck.filter.collection',
});

const shiny = settings.register({
  ...base,
  // TODO: translation
  name: 'Merge Shiny Cards',
  key: 'underscript.deck.filter.shiny',
  // TODO: translation
  options: ['Never (default)', 'Deck', 'Always'],
  default: 'Deck',
});

style.add(
  '#collectionType { margin-bottom: 10px; }',
  '.filter input+* {  opacity: 0.4; }',
  '.filter input:checked+* {  opacity: 1; }',
  '.filter input:disabled, .filter input:disabled+* { display: none; }',
);

function applyLook(refresh = decks || crafting) {
  $('input[onchange^="applyFilters();"]').parent().parent().toggleClass('filter', !setting.value());
  if (crafting) {
    if (setting.value() || !splitBaseGen.value()) {
      $('#baseGenInput').prop('checked', false).prop('disabled', false);
      $('.rarityInput.custom').parent().remove();
    } else if (!$('#baseRarityInput').length) {
      // Add BASE
      $('#commonRarityInput').parent().before(createButton('BASE'), ' ');
      $('#baseGenInput').prop('checked', true).prop('disabled', true).parent()
        .after(createButton('TOKEN'));
    }
  }

  // Tribe filter
  if (setting.value()) {
    $('#allTribeInput').parent().remove();
  } else if (!$('#allTribeInput').length) {
    $('#monsterInput').parent().before(allTribeButton(), ' ');
  }
  $('#allTribeInput').prop('disabled', !tribe.value());

  const allCardsElement = $('[data-i18n="[html]crafting-all-cards"]');
  if (setting.value() || !owned.value()) {
    $('#collectionType').remove();
    allCardsElement.toggleClass('invisible', false);
  } else if (!$('#collectionType').length) {
    allCardsElement.toggleClass('invisible', true)
      .after(ownSelect());
  }

  $('#shinyInput').prop('disabled', mergeShiny());
  if (refresh) {
    global('applyFilters')();
    global('showPage')(0);
  }
}

eventManager.on(':preload:Decks :preload:Crafting', () => {
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

function ownSelect() {
  if (!global('translationReady', { throws: false })) {
    eventManager.once('translation:loaded', () => applyLook(false));
    return '';
  }
  // TODO: translation
  return $(`
  <select id="collectionType" onchange="applyFilters(); showPage(0);">
    <option value="all">${translateText('crafting-all-cards')}</option>
    <option value="owned">Owned cards</option>
    <option value="unowned">Unowned cards</option>
    <option value="maxed">Maxed cards</option>
    <option value="surplus">Surplus cards</option>
    <option value="craftable">Craftable cards</option>
  </select>
  `);
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
  function ownedFilter(card, removed) {
    if (!removed && crafting && owned.value()) {
      switch ($('#collectionType').val()) {
        case 'owned': return !card.quantity;
        case 'unowned': return card.quantity > 0;
        case 'maxed': return card.quantity < max(card.rarity);
        case 'surplus': return card.quantity <= max(card.rarity);
        case 'craftable': return card.quantity >= max(card.rarity);
        case 'all':
        default: break;
      }
    }
    return removed;
  },
);
