const cardHelper = wrap(() => {
  const unset = [undefined, null];
  function max(rarity) { // eslint-disable-line no-shadow
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

  function isShiny(el) {
    return el.classList.contains('shiny');
  }

  function find(id, shiny) {
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

  function name(el) {
    return el.querySelector('.cardName').textContent;
  }

  function rarity(el) {
    return getCardData(el.id).rarity;
  }

  function quantity(el) {
    return parseInt(el.querySelector('.cardQuantity .nb, #quantity .nb, .quantity .nb').textContent, 10);
  }

  function cost(el) {
    return parseInt(el.querySelector('.cardCost').textContent, 10);
  }

  function totalDust() {
    return parseInt(document.querySelector('span#dust').textContent, 10);
  }

  function dustCost(r, s) {
    if (typeof r === 'object') {
      if (typeof s !== 'boolean') {
        s = isShiny(r);
      }
      r = rarity(r);
    }
    switch (r) {
      default:
      case 'DETERMINATION': return null;
      case 'LEGENDARY': return s ? 3200 : 1600;
      case 'EPIC': return s ? 1600 : 400;
      case 'RARE': return s ? 800 : 100;
      case 'COMMON': return s ? 400 : 40;
      case 'BASE': return s ? 400 : null;
    }
  }

  function dustGain(r, s) {
    if (typeof r === 'object') {
      if (typeof s !== 'boolean') {
        s = isShiny(r);
      }
      r = rarity(r);
    }
    switch (r) {
      default: fn.debug(`Unknown Rarity: ${r}`); // fallthrough
      case 'TOKEN':
      case 'GENERATED': // You can't craft this, but I don't want an error
      case 'DETERMINATION': return undefined;
      case 'LEGENDARY': return s ? 1600 : 400;
      case 'EPIC': return s ? 400 : 100;
      case 'RARE': return s ? 100 : 20;
      case 'COMMON': return s ? 40 : 5;
      case 'BASE': return s ? 40 : 0;
    }
  }

  function getCardData(id) {
    const cards = global('allCards').filter((card) => card.id === parseInt(id, 10));
    if (cards.length) return cards[0];
    throw new Error(`Unknown card ${id}`);
  }

  return {
    cost,
    find,
    name,
    rarity,
    shiny: isShiny,
    craft: {
      max,
      quantity,
      totalDust,
      cost: dustCost,
      worth: dustGain,
    },
  };
});

api.module.utils.rarity = Object.freeze({
  max(rarity = '') {
    if (!rarity) throw new Error('Rarity required!');
    return cardHelper.craft.max(rarity);
  },
  cost(rarity = '', shiny = false) {
    if (!rarity) throw new Error('Rarity required!');
    return cardHelper.craft.dustCost(rarity, shiny);
  },
  dust(rarity = '', shiny = false) {
    if (!rarity) throw new Error('Rarity required!');
    return cardHelper.craft.dustGain(rarity, shiny);
  },
});
