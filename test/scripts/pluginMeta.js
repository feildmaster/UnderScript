import { expect } from 'chai';
import { build } from '../../scripts/pluginMeta.js';

const entries = [
  { name: 'Beta', updateURL: 'https://example.com/b.user.js' },
  { name: 'Alpha', updateURL: 'https://example.com/a.user.js' },
];

function tools(versions, dates = {}) {
  const lookups = [];
  return {
    lookups,
    resolve: async ({ name }) => {
      const version = versions[name];
      if (version instanceof Error) throw version;
      return { version, url: 'https://example.com' };
    },
    lookupDate: async ({ name }) => {
      lookups.push(name);
      const date = dates[name];
      if (date instanceof Error) throw date;
      return date;
    },
  };
}

describe('plugins.meta.json', () => {
  it('records the date of each plugin, sorted by name', async () => {
    const meta = await build(entries, {}, tools({ Alpha: '1', Beta: '2' }, { Alpha: 'a-date', Beta: 'b-date' }));
    expect(Object.keys(meta)).to.deep.equal(['Alpha', 'Beta']);
    expect(meta.Beta).to.deep.equal({ version: '2', date: 'b-date' });
  });

  it('keeps the stored date while the version is unchanged', async () => {
    const helpers = tools({ Alpha: '1', Beta: '2' }, { Alpha: 'new', Beta: 'new' });
    const previous = { Alpha: { version: '1', date: 'old' } };
    const meta = await build(entries, previous, helpers);
    expect(meta.Alpha.date).to.equal('old');
    expect(helpers.lookups).to.deep.equal(['Beta']);
  });

  it('takes a new date when the version changes', async () => {
    const previous = { Alpha: { version: '1', date: 'old' } };
    const meta = await build(entries, previous, tools({ Alpha: '2', Beta: '1' }, { Alpha: 'new', Beta: 'x' }));
    expect(meta.Alpha).to.deep.equal({ version: '2', date: 'new' });
  });

  it('keeps the stored entry when a plugin cannot be resolved', async () => {
    const previous = { Alpha: { version: '1', date: 'old' } };
    const meta = await build(entries, previous, tools({ Alpha: new Error('down'), Beta: '1' }, { Beta: 'x' }));
    expect(meta.Alpha).to.deep.equal(previous.Alpha);
  });

  it('leaves a plugin out when its date is unknown or fails', async () => {
    const dates = { Alpha: undefined, Beta: new Error('rate limit') };
    const meta = await build(entries, {}, tools({ Alpha: '1', Beta: '1' }, dates));
    expect(meta).to.deep.equal({});
  });

  it('forgets plugins that left the registry', async () => {
    const previous = { Gone: { version: '1', date: 'old' } };
    const meta = await build(entries, previous, tools({ Alpha: '1', Beta: '1' }, { Alpha: 'a', Beta: 'b' }));
    expect(meta).to.not.have.property('Gone');
  });
});
