import { expect } from 'chai';
import Constant from 'src/structures/constants/constant.js';
import Item from 'src/structures/constants/item.js';
import Priority from 'src/structures/constants/priority.js';

function constants(values) {
  class Test extends Constant {}
  Object.entries(values).forEach(([key, names]) => {
    Test[key] = new Test(...names);
  });
  return Test;
}

describe('Constant', () => {
  const Color = constants({ RED: ['red', 'r'], BLUE: ['blue'] });
  const Shape = constants({ SQUARE: ['square'] });

  describe('find', () => {
    it('finds a constant by its name', () => {
      expect(Color.find('red')).to.equal(Color.RED);
      expect(Color.find('blue')).to.equal(Color.BLUE);
    });

    it('finds a constant by another name it has', () => {
      expect(Color.find('r')).to.equal(Color.RED);
    });

    it('returns a constant it is given', () => {
      expect(Color.find(Color.BLUE)).to.equal(Color.BLUE);
    });

    it('returns undefined for something unknown', () => {
      expect(Color.find('green')).to.equal(undefined);
      expect(Color.find(undefined)).to.equal(undefined);
    });

    it('only looks at its own constants', () => {
      expect(Color.find(Shape.SQUARE)).to.equal(undefined);
      expect(Color.find('square')).to.equal(undefined);
      expect(Constant.find('red')).to.equal(undefined);
    });
  });

  describe('lock', () => {
    const Size = constants({ SMALL: ['small'], LARGE: ['large'] });

    before(() => Size.lock());

    it('keeps finding constants', () => {
      expect(Size.find('large')).to.equal(Size.LARGE);
    });

    it('refuses new constants', () => {
      expect(() => { Size.HUGE = new Size('huge'); }).to.throw(TypeError);
      expect(() => Object.defineProperty(Size, 'HUGE', { value: new Size('huge') })).to.throw(TypeError);
      expect(Size.find('huge')).to.equal(undefined);
    });

    it('refuses replacing a constant', () => {
      expect(() => { Size.SMALL = new Size('tiny'); }).to.throw(TypeError);
      expect(Size.find('small')).to.equal(Size.SMALL);
    });

    it('refuses changing a constant', () => {
      expect(() => { Size.SMALL.extra = true; }).to.throw(TypeError);
    });

    it('refuses replacing equals or find', () => {
      expect(() => { Size.prototype.equals = () => true; }).to.throw(TypeError);
      expect(() => { Size.find = () => Size.SMALL; }).to.throw(TypeError);
    });
  });
});

describe('Item and Priority', () => {
  it('finds an item by name', () => {
    expect(Item.find('gold')).to.equal(Item.GOLD);
    expect(Item.find('reward-dr-pack')).to.equal(Item.DR_PACK);
  });

  it('does not find a priority as an item', () => {
    expect(Item.find('high')).to.equal(undefined);
    expect(Item.find(Priority.HIGH)).to.equal(undefined);
  });

  it('finds a priority by name', () => {
    expect(Priority.find('high')).to.equal(Priority.HIGH);
    expect(Priority.find('top')).to.equal(Priority.FIRST);
    expect(Priority.find('bottom')).to.equal(Priority.LAST);
  });

  it('still has get for finding a priority', () => {
    expect(Priority.get('normal')).to.equal(Priority.NORMAL);
    expect(Priority.get('nope')).to.equal(undefined);
  });
});
