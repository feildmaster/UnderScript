import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global, globalSet } from 'src/utils/global.js';
import style from 'src/utils/style.js';
import onPage from 'src/utils/onPage.js';
import { max } from 'src/utils/cardHelper.js';
import Translation from 'src/structures/constants/translation.ts';
import { getTranslationArray } from '../underscript/translation.js';

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
  category: Translation.Setting('category.filter'),
  page: 'Library',
  default: true,
};

const setting = settings.register({
  ...base,
  default: false,
  name: Translation.Setting('filter.disable'),
  key: 'underscript.deck.filter.disable',
});

const tribe = settings.register({
  ...base,
  name: Translation.Setting('filter.tribe'),
  key: 'underscript.deck.filter.tribe',
});

const owned = settings.register({
  ...base,
  name: Translation.Setting('filter.collection'),
  key: 'underscript.deck.filter.collection',
});

const shiny = settings.register({
  ...base,
  name: Translation.Setting('filter.shiny'),
  key: 'underscript.deck.filter.shiny',
  options: () => {
    const { key } = Translation.Setting('filter.shiny.option');
    const options = getTranslationArray(key);
    return ['Never (default)', 'Deck', 'Always'].map((val, i) => [
      options[i],
      val,
    ]);
  },
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
  if (crafting && !setting.value()) {
    $('input[rarity]:checked').prop('checked', false);
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
    allCardsElement.removeClass('invisible');
  } else if (!$('#collectionType').length) {
    eventManager.on('underscript:ready', () => {
      allCardsElement.addClass('invisible')
        .after(ownSelect());
    });
  }

  // Re-add shiny filter
  if (!$('#shinyInput').length) {
    $('#utyInput').parent().after(shinyButton());
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
    const results = new Map();
    return filters.reduce((removed, func) => {
      if (!func) return removed;
      const val = func.call(this, card, removed, Object.fromEntries(results));
      const key = func.displayName || func.name;
      if (typeof val === 'boolean') {
        results.set(key, val !== removed);
        return val;
      }
      results.set(key, null);
      return removed;
    }, false);
  });
});

function mergeShiny() {
  return shiny.value() === 'Always' || (decks && shiny.value() === 'Deck');
}

function allTribeButton() {
  return $(`
  <label>
    <input type="checkbox" id="allTribeInput" onchange="applyFilters(); showPage(currentPage);">
    <img src="images/tribes/ALL.png">
  </label>`);
}

function shinyButton() {
  return $(`
  <label>
    <input type="checkbox" id="shinyInput" onchange="applyFilters(); showPage(currentPage);">
    <span class="rainbowText">S</span>
  </label>`);
}

function ownSelect() {
  return $(`
  <select id="collectionType" onchange="applyFilters(); showPage(0);">
    <option value="all">${Translation.Vanilla('crafting-all-cards')}</option>
    <option value="owned">${Translation.General('cards.owned')}</option>
    <option value="unowned">${Translation.General('cards.unowned')}</option>
    <option value="maxed">${Translation.General('cards.maxed')}</option>
    <option value="surplus">${Translation.General('cards.surplus')}</option>
    <option value="craftable">${Translation.General('cards.craftable')}</option>
  </select>
  `);
}

filters.push(
  // function isRemoved(card) {
  //   // Shiny, Rarity, Type, Extension, Search
  //   return this.super(card);
  // },
  // eslint-disable-next-line no-shadow
  function shiny(card, removed) {
    if (removed) return null;
    if (mergeShiny()) return false;
    return card.shiny !== $('#shinyInput').prop('checked');
  },
  function rarity(card, removed) {
    if (removed) return null;
    const rarities = $('.rarityInput:checked').map(function getRarity() {
      return this.getAttribute('rarity');
    }).get();
    return rarities.length > 0 && !rarities.includes(card.rarity);
  },
  function type(card, removed) {
    if (removed) return null;
    const monster = $('#monsterInput').prop('checked');
    const spell = $('#spellInput').prop('checked');
    const cardType = monster ? 0 : 1;
    return monster !== spell && card.typeCard !== cardType;
  },
  function extension(card, removed) {
    if (removed) return null;
    const extensions = [];
    if ($('#undertaleInput').prop('checked')) {
      extensions.push('BASE');
    }
    if ($('#deltaruneInput').prop('checked')) {
      extensions.push('DELTARUNE');
    }
    if ($('#utyInput').prop('checked')) {
      extensions.push('UTY');
    }
    return extensions.length > 0 && !extensions.includes(card.extension);
  },
  function search(card, removed) {
    if (removed) return null;
    const text = $('#searchInput').val().toLowerCase();
    if (!text.length) return false;
    function includes(dirty) {
      return dirty.replace(/(<.*?>)/g, '').toLowerCase().includes(text);
    }
    return (
      !includes($.i18n(`card-name-${card.id}`, 1)) &&
      !includes($.i18n(`card-${card.id}`)) &&
      !(card.soul?.name && includes($.i18n(`soul-${card.soul.name.toLowerCase().replace(/_/g, '-')}`))) &&
      !card.tribes.some((t) => includes($.i18n(`tribe-${t.toLowerCase().replace(/_/g, '-')}`)))
    );
  },
  crafting && function baseGenFilter(card, removed) {
    if (removed || $('.rarityInput:checked').length) return null;
    return ['BASE', 'TOKEN'].includes(card.rarity);
  },
  function tribeFilter(card, removed) {
    if (removed || !tribe.value()) return null;
    return $('#allTribeInput').prop('checked') && !card.tribes.length;
  },
  crafting && function ownedFilter(card, removed) {
    if (removed || !owned.value()) return null;
    switch ($('#collectionType').val()) {
      case 'owned': return !card.quantity;
      case 'unowned': return card.quantity > 0;
      case 'maxed': return card.quantity < max(card.rarity);
      case 'surplus': return card.quantity <= max(card.rarity);
      case 'craftable': return card.quantity >= max(card.rarity);
      case 'all':
      default: return false;
    }
  },
);
