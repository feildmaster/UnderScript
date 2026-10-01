import { expect } from 'chai';
import Translation from 'src/structures/constants/translation.js';

describe('Translation', () => {
  it('prefixes the key with its namespace', () => {
    expect(Translation.General('search').key).to.equal('underscript.general.search');
    expect(Translation.Menu('plugins').key).to.equal('underscript.menu.plugins');
  });

  it('falls back to the provided text when translations are not loaded', () => {
    expect(`${Translation.General('missing', 'Fallback')}`).to.equal('Fallback');
  });

  it('substitutes no arguments by default', () => {
    expect(Translation.General('plain', 'Plain').translate()).to.equal('Plain');
  });

  it('keeps arguments set with withArgs', () => {
    const withArgs = Translation.General('tabs.next', 'Next ($1 of $2)').withArgs('1', '3');
    expect(withArgs).to.be.instanceOf(Translation);
    expect(withArgs.key).to.equal('underscript.general.tabs.next');
  });

  it('exposes vanilla keys without the underscript prefix', () => {
    expect(Translation.CLOSE.key).to.equal('dialog-close');
  });
});
