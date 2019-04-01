const cardHelper = wrap(() => {
  const unset = [undefined, null];
  function max(rarity) {
    switch (rarity) {
      case 'DETERMINATION':
      case 'LEGENDARY': return 1;
      case 'EPIC': return 2;
      case 'RARE':
      case 'BASE':
      case 'COMMON': return 3;
      case 'GENERATED': return 0;
      default: debug(`Unknown rarity: ${rarity}`);
    }
  }

  function isShiny(el) {
    return el.classList.contains('shiny');
  }

  function find(id, shiny) {
    const elements = document.querySelectorAll(`table[id="${id}"]`);
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
    return el.querySelector('#cardRarity img').title;
  }

  function quantity(el) {
    return parseInt(el.querySelector('#quantity .nb').textContent, 10);
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
      case 'COMMON': return s ? 400: 40;
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
      default: fn.debug(`Unknown Rarity: ${r}`);
      case 'GENERATED': // You can't craft this, but I don't want an error
      case 'DETERMINATION': return;
      case 'LEGENDARY': return s ? 1600 : 400;
      case 'EPIC': return s ? 400 : 100;
      case 'RARE': return s ? 100 : 20;
      case 'COMMON': return s ? 40 : 5;
      case 'BASE': return s ? 40 : 0;
    }
  }

  return {
    cost, find, name, rarity,
    shiny: isShiny,
    craft: {
      max, quantity, totalDust,
      cost: dustCost,
      worth: dustGain,
    },
  };
});
