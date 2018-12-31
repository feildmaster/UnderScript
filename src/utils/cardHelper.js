const cardHelper = (() => {
  const unset = [undefined, null];
  function max(rarity) {
    switch (rarity) {
      case 'DETERMINATION':
      case 'LEGENDARY': return 1;
      case 'EPIC': return 2;
      case 'RARE':
      case 'COMMON': return 3;
      default: debug(`Unknown rarity: ${rarity}`);
    }
  }

  function isShiny(el) {
    return el.classList.contains('shiny');
  }

  function find(id, shiny) {
    console.log('find', id, shiny);
    const elements = document.querySelectorAll(`table[id="${id}"]`);
    if (shiny !== undefined) {
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        console.log('Checking', el);
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

  function dustCost(el, r, s) {
    if (typeof el !== 'object') {
      if (el !== null) {
        if (typeof el !== 'string' && typeof r !== 'boolean') {
          throw new Error();
        } else {
          s = r;
          r = el;
        }
      }
    } else {
      r = r || rarity(el);
      s = s || isShiny(el);
    }
    if (unset.contains(r) || unset.contains(s)) throw new Error();
    switch (r) {
      default:
      case 'DETERMINATION': return null;
      case 'LEGENDARY': return s ? 3200 : 1600;
      case 'EPIC': return s ? 1600 : 400;
      case 'RARE': return s ? 800 : 100;
      case 'COMMON': return s ? 100: 40;
    }
  }

  return {
    cost, find, name, rarity,
    craft: {
      max, quantity, totalDust,
      cost: dustCost,
    }
  };
})();
