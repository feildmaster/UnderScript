/* eslint-disable no-param-reassign */
import * as api from './4.api.js';
import { debug } from './debug.js';
import { global } from './global.js';
import { translateText } from './translate.js';

const unset = [undefined, null];
export function max(rarity) { // eslint-disable-line no-shadow
  switch (rarity) {
    case 'DETERMINATION':
    case 'LEGENDARY': return 1;
    case 'EPIC': return 2;
    case 'RARE':
    case 'BASE':
    case 'COMMON': return 3;
    case 'TOKEN':
    case 'GENERATED': return 0;
    default:
      debug(`Unknown rarity: ${rarity}`);
      return undefined;
  }
}

export function isShiny(el) {
  return el.classList.contains('shiny');
}

export function find(id, shiny) {
  const elements = document.querySelectorAll(`[id="${id}"]`);
  if (shiny !== undefined) {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (shiny === isShiny(el)) {
        return el;
      }
    }
  }
  return elements[0];
}

export function name(el) {
  return el.querySelector('.cardName').textContent;
}

export function rarity(el) {
  return getCardData(el.id).rarity;
}

export function quantity(el) {
  return parseInt(el.querySelector('.cardQuantity .nb, #quantity .nb, .quantity .nb').textContent, 10);
}

export function cost(el) {
  return parseInt(el.querySelector('.cardCost').textContent, 10);
}

export function totalDust() {
  return parseInt(document.querySelector('span#dust').textContent, 10);
}

export function craftable(el) {
  const r = rarity(el);
  if (quantity(el) >= max(r)) {
    return false;
  }
  const s = isShiny(el);
  switch (r) {
    case 'DETERMINATION': return fragCost(r, s) <= totalFrags();
    case 'LEGENDARY':
    case 'EPIC':
    case 'RARE':
    case 'COMMON':
    case 'BASE': {
      const dust = dustCost(r, s);
      return dust !== null && dust <= totalDust();
    }
    case 'TOKEN':
    case 'GENERATED': return false;
    default: {
      debug(`Unknown Rarity: ${r}`);
      return false;
    }
  }
}

export function totalFrags() {
  return Number(document.querySelector('span#nbDTFragments').textContent);
}

export function fragCost(r, s) {
  if (typeof r === 'object') {
    if (typeof s !== 'boolean') {
      s = isShiny(r);
    }
    r = rarity(r);
  }
  switch (r) {
    case 'DETERMINATION': return s ? 8 : 4;
    default: return null;
  }
}

export function fragGain(r, s) {
  if (typeof r === 'object') {
    if (typeof s !== 'boolean') {
      s = isShiny(r);
    }
    r = rarity(r);
  }
  switch (r) {
    case 'DETERMINATION': return s ? 4 : 2;
    default: return null;
  }
}

export function dustCost(r, s) {
  if (typeof r === 'object') {
    if (typeof s !== 'boolean') {
      s = isShiny(r);
    }
    r = rarity(r);
  }
  switch (r) {
    case 'DETERMINATION': return null;
    case 'LEGENDARY': return s ? 3200 : 1600;
    case 'EPIC': return s ? 1600 : 400;
    case 'RARE': return s ? 800 : 100;
    case 'COMMON': return s ? 400 : 40;
    case 'BASE': return s ? 400 : null;
    default: return null;
  }
}

export function dustGain(r, s) {
  if (typeof r === 'object') {
    if (typeof s !== 'boolean') {
      s = isShiny(r);
    }
    r = rarity(r);
  }
  switch (r) {
    case 'TOKEN':
    case 'GENERATED': // You can't craft this, but I don't want an error
    case 'DETERMINATION': return null;
    case 'LEGENDARY': return s ? 1600 : 400;
    case 'EPIC': return s ? 400 : 100;
    case 'RARE': return s ? 100 : 20;
    case 'COMMON': return s ? 40 : 5;
    case 'BASE': return s ? 40 : null;
    default: {
      debug(`Unknown Rarity: ${r}`);
      return null;
    }
  }
}

export function getCardData(id) {
  const cards = global('allCards').filter((card) => card.id === parseInt(id, 10));
  if (cards.length) return cards[0];
  throw new Error(`Unknown card ${id}`);
}

export function cardName(card, fallback = card.name) {
  return translateText(`card-name-${card.id}`, {
    args: [1],
    fallback,
  });
}

api.mod.utils.rarity = Object.freeze({
  max(cardRarity = '') {
    if (!cardRarity) throw new Error('Rarity required!');
    return max(cardRarity);
  },
  cost(cardRarity = '', shiny = false) {
    if (!cardRarity) throw new Error('Rarity required!');
    return dustCost(cardRarity, shiny);
  },
  dust(cardRarity = '', shiny = false) {
    if (!cardRarity) throw new Error('Rarity required!');
    return dustGain(cardRarity, shiny);
  },
});
