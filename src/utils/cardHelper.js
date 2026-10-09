/* eslint-disable no-param-reassign */
import Rarity from 'src/structures/constants/rarity.js';
import * as api from './4.api.js';
import { debug } from './debug.js';
import eventManager from './eventManager.js';
import { translateText } from './translate.js';

const cardMap = new Map();

eventManager.on('allCardsReady', (allCards) => {
  allCards.forEach((card) => {
    cardMap.set(card.id, card);
  });
});

const unset = [undefined, null];
export function max(rarity) { // eslint-disable-line no-shadow
  switch (Rarity.find(rarity)) {
    case Rarity.DETERMINATION:
    case Rarity.LEGENDARY: return 1;
    case Rarity.EPIC: return 2;
    case Rarity.RARE:
    case Rarity.BASE:
    case Rarity.COMMON: return 3;
    case Rarity.TOKEN: return 0;
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
  switch (Rarity.find(r)) {
    case Rarity.DETERMINATION: return fragCost(r, s) <= totalFrags();
    case Rarity.LEGENDARY:
    case Rarity.EPIC:
    case Rarity.RARE:
    case Rarity.COMMON:
    case Rarity.BASE: {
      const dust = dustCost(r, s);
      return dust !== null && dust <= totalDust();
    }
    case Rarity.TOKEN: return false;
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
  if (typeof r === 'object' && !(r instanceof Rarity)) {
    if (typeof s !== 'boolean') {
      s = isShiny(r);
    }
    r = rarity(r);
  }
  switch (Rarity.find(r)) {
    case Rarity.DETERMINATION: return s ? 8 : 4;
    default: return null;
  }
}

export function fragGain(r, s) {
  if (typeof r === 'object' && !(r instanceof Rarity)) {
    if (typeof s !== 'boolean') {
      s = isShiny(r);
    }
    r = rarity(r);
  }
  switch (Rarity.find(r)) {
    case Rarity.DETERMINATION: return s ? 4 : 2;
    default: return null;
  }
}

export function dustCost(r, s) {
  if (typeof r === 'object' && !(r instanceof Rarity)) {
    if (typeof s !== 'boolean') {
      s = isShiny(r);
    }
    r = rarity(r);
  }
  switch (Rarity.find(r)) {
    case Rarity.DETERMINATION: return null;
    case Rarity.LEGENDARY: return s ? 3200 : 1600;
    case Rarity.EPIC: return s ? 1600 : 400;
    case Rarity.RARE: return s ? 800 : 100;
    case Rarity.COMMON: return s ? 400 : 40;
    case Rarity.BASE: return s ? 400 : null;
    default: return null;
  }
}

export function dustGain(r, s) {
  if (typeof r === 'object' && !(r instanceof Rarity)) {
    if (typeof s !== 'boolean') {
      s = isShiny(r);
    }
    r = rarity(r);
  }
  switch (Rarity.find(r)) {
    case Rarity.TOKEN: // You can't craft this, but I don't want an error
    case Rarity.DETERMINATION: return null;
    case Rarity.LEGENDARY: return s ? 1600 : 400;
    case Rarity.EPIC: return s ? 400 : 100;
    case Rarity.RARE: return s ? 100 : 20;
    case Rarity.COMMON: return s ? 40 : 5;
    case Rarity.BASE: return s ? 40 : null;
    default: {
      debug(`Unknown Rarity: ${r}`);
      return null;
    }
  }
}

export function getCardData(id) {
  const card = cardMap.get(Number(id));
  if (card) return card;
  throw new Error(`Unknown card ${id}`);
}

export function cardName(card, fallback = card.name) {
  return translateText(`card-name-${card.fixedId || card.id}`, {
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
