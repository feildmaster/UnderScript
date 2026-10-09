import { expect } from 'chai';

const RARITIES = ['BASE', 'COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'DETERMINATION', 'TOKEN', 'GENERATED'];

describe('cardHelper', () => {
  let helper;

  before(async () => {
    helper = await import('../../src/utils/cardHelper.js');
  });

  describe('max', () => {
    const expected = {
      BASE: 3,
      COMMON: 3,
      RARE: 3,
      EPIC: 2,
      LEGENDARY: 1,
      DETERMINATION: 1,
      TOKEN: 0,
      GENERATED: 0,
    };

    RARITIES.forEach((rarity) => {
      it(`allows ${expected[rarity]} of a ${rarity} card`, () => {
        expect(helper.max(rarity)).to.equal(expected[rarity]);
      });
    });

    it('does not know other rarities', () => {
      expect(helper.max('MYTHIC')).to.equal(undefined);
    });
  });

  describe('dustCost', () => {
    const expected = {
      BASE: [null, 400],
      COMMON: [40, 400],
      RARE: [100, 800],
      EPIC: [400, 1600],
      LEGENDARY: [1600, 3200],
      DETERMINATION: [null, null],
      TOKEN: [null, null],
      GENERATED: [null, null],
    };

    RARITIES.forEach((rarity) => {
      it(`costs ${expected[rarity]} for a ${rarity} card`, () => {
        expect(helper.dustCost(rarity, false)).to.equal(expected[rarity][0]);
        expect(helper.dustCost(rarity, true)).to.equal(expected[rarity][1]);
      });
    });

    it('does not know other rarities', () => {
      expect(helper.dustCost('MYTHIC', false)).to.equal(null);
    });
  });

  describe('dustGain', () => {
    const expected = {
      BASE: [null, 40],
      COMMON: [5, 40],
      RARE: [20, 100],
      EPIC: [100, 400],
      LEGENDARY: [400, 1600],
      DETERMINATION: [null, null],
      TOKEN: [null, null],
      GENERATED: [null, null],
    };

    RARITIES.forEach((rarity) => {
      it(`gives ${expected[rarity]} for a ${rarity} card`, () => {
        expect(helper.dustGain(rarity, false)).to.equal(expected[rarity][0]);
        expect(helper.dustGain(rarity, true)).to.equal(expected[rarity][1]);
      });
    });

    it('does not know other rarities', () => {
      expect(helper.dustGain('MYTHIC', false)).to.equal(null);
    });
  });

  describe('fragments', () => {
    RARITIES.forEach((rarity) => {
      const determination = rarity === 'DETERMINATION';

      it(`${determination ? 'costs' : 'does not cost'} fragments for a ${rarity} card`, () => {
        expect(helper.fragCost(rarity, false)).to.equal(determination ? 4 : null);
        expect(helper.fragCost(rarity, true)).to.equal(determination ? 8 : null);
      });

      it(`${determination ? 'gives' : 'does not give'} fragments for a ${rarity} card`, () => {
        expect(helper.fragGain(rarity, false)).to.equal(determination ? 2 : null);
        expect(helper.fragGain(rarity, true)).to.equal(determination ? 4 : null);
      });
    });
  });

  describe('craftable', () => {
    before(async () => {
      const { default: eventManager } = await import('../../src/utils/eventManager.js');
      eventManager.emit(
        'allCardsReady',
        RARITIES.map((rarity, index) => ({ id: 100 + index, rarity })),
      );
    });

    function check(rarity, { shiny = false, owned = 0 } = {}) {
      const id = 100 + RARITIES.indexOf(rarity);
      document.body.innerHTML = `
        <span id="dust">1000</span>
        <span id="nbDTFragments">5</span>
        <div id="${id}" class="card${shiny ? ' shiny' : ''}">
          <div class="cardQuantity"><span class="nb">${owned}</span></div>
        </div>`;
      return helper.craftable(document.getElementById(id));
    }

    it('crafts a common card with enough dust', () => {
      expect(check('COMMON')).to.equal(true);
    });

    it('does not craft a card that costs more dust than you have', () => {
      expect(check('EPIC', { shiny: true })).to.equal(false);
    });

    it('does not craft a card you have the maximum of', () => {
      expect(check('LEGENDARY', { owned: 1 })).to.equal(false);
    });

    it('crafts a determination card with enough fragments', () => {
      expect(check('DETERMINATION')).to.equal(true);
      expect(check('DETERMINATION', { shiny: true })).to.equal(false);
    });

    it('crafts a base card only when shiny', () => {
      expect(check('BASE')).to.equal(false);
      expect(check('BASE', { shiny: true })).to.equal(true);
    });

    it('never crafts tokens or generated cards', () => {
      expect(check('TOKEN')).to.equal(false);
      expect(check('GENERATED')).to.equal(false);
    });
  });
});
