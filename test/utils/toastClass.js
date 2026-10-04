import { expect } from 'chai';
import addToastClass from '../../src/utils/toastClass.js';

describe('addToastClass', () => {
  it('returns just the class when there is nothing to add to', () => {
    expect(addToastClass(undefined, 'base')).to.deep.equal(['base']);
  });

  it('adds to a string', () => {
    expect(addToastClass('mine', 'base')).to.deep.equal(['base', 'mine']);
  });

  it('adds to an array', () => {
    expect(addToastClass(['one', 'two'], 'base')).to.deep.equal(['base', 'one', 'two']);
  });

  it('adds to the toast part of a sectioned class name and keeps the button part', () => {
    expect(addToastClass({ toast: 'one', button: 'btn' }, 'base')).to.deep.equal({ toast: ['base', 'one'], button: 'btn' });
    expect(addToastClass({ toast: ['one', 'two'] }, 'base')).to.deep.equal({ toast: ['base', 'one', 'two'] });
  });

  it('creates the toast part when only the button part is given', () => {
    expect(addToastClass({ button: 'btn' }, 'base')).to.deep.equal({ toast: ['base'], button: 'btn' });
  });

  it('does not change what it was given', () => {
    const sectioned = { toast: 'one', button: 'btn' };
    const list = ['one'];
    addToastClass(sectioned, 'base');
    addToastClass(list, 'base');
    expect(sectioned).to.deep.equal({ toast: 'one', button: 'btn' });
    expect(list).to.deep.equal(['one']);
  });
});
