import { expect } from 'chai';

describe('underscript api', () => {
  let api;

  before(async () => {
    api = await import('../../src/utils/4.api.js');
  });

  after(() => {
    delete globalThis.underscript;
  });

  it('exposes the version', () => {
    expect(globalThis.underscript.version).to.equal(GM_info.script.version);
  });

  it('returns primitives untouched', () => {
    api.register('count', 3);
    api.register('flag', false);
    api.register('empty', null);
    expect(globalThis.underscript.count).to.equal(3);
    expect(globalThis.underscript.flag).to.equal(false);
    expect(globalThis.underscript.empty).to.equal(null);
  });

  it('protects registered objects from writes', () => {
    api.register('thing', { value: 1 });
    Reflect.set(globalThis.underscript.thing, 'value', 2);
    expect(globalThis.underscript.thing.value).to.equal(1);
  });

  it('keeps registered functions callable', () => {
    api.register('double', (n) => n * 2);
    expect(globalThis.underscript.double(4)).to.equal(8);
  });

  it('ignores writes to the api itself', () => {
    Reflect.set(globalThis.underscript, 'version', 'hacked');
    expect(globalThis.underscript.version).to.equal(GM_info.script.version);
  });
});
