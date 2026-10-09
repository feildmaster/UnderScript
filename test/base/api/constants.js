import { expect } from 'chai';

describe('underscript constants', () => {
  let constants;

  before(async () => {
    await import('../../../src/base/api/constants.js');
    ({ constants } = globalThis.underscript);
  });

  it('finds an item by name', () => {
    expect(constants.isItem('gold')).to.equal(true);
    expect(`${constants.getItem('gold')}`).to.equal('Gold');
  });

  it('finds a priority by name', () => {
    expect(constants.isPriority('high')).to.equal(true);
    expect(`${constants.getPriority('high')}`).to.equal('high');
  });

  it('knows when something is not a priority', () => {
    expect(constants.isPriority('not a priority')).to.equal(false);
    expect(constants.getPriority('not a priority')).to.equal(undefined);
  });
});
