import { expect } from 'chai';
import { createFilter, parse, serialize } from '../../src/utils/settings/portable.js';

const setting = (key, extra = {}) => ({ key, exportable: true, ...extra });

describe('portable settings', () => {
  beforeEach(() => localStorage.clear());

  describe('createFilter', () => {
    it('accepts registered keys and notices', () => {
      const accepts = createFilter([setting('language')]);
      expect(accepts('language')).to.equal(true);
      expect(accepts('underscript.notice.welcome')).to.equal(true);
      expect(accepts('allCards')).to.equal(false);
    });

    it('accepts plugin keys even when the plugin is not registered', () => {
      const accepts = createFilter([]);
      expect(accepts('underscript.plugin.Wizascript.decktracker.enabled')).to.equal(true);
    });

    it('still rejects a registered plugin setting that is not exportable', () => {
      const key = 'underscript.plugin.Wizascript.plugin.registered';
      const accepts = createFilter([setting(key, { exportable: false })]);
      expect(accepts(key)).to.equal(false);
    });

    it('accepts keys under a registered extra prefix', () => {
      const accepts = createFilter([setting('rows', { extraPrefix: 'underscript.deck.' })]);
      expect(accepts('underscript.deck.1')).to.equal(true);
    });

    it('rejects settings marked as not exportable, along with their prefix', () => {
      const accepts = createFilter([
        setting('cache', { exportable: false, extraPrefix: 'cache.' }),
      ]);
      expect(accepts('cache')).to.equal(false);
      expect(accepts('cache.1')).to.equal(false);
    });
  });

  describe('serialize and parse', () => {
    const accepts = createFilter([setting('language'), setting('chatRainbowDisabled')]);

    it('returns an empty string when there is nothing to export', () => {
      localStorage.setItem('unrelated', 'x');
      expect(serialize(localStorage, accepts)).to.equal('');
    });

    it('round trips only accepted keys', () => {
      localStorage.setItem('language', 'fr');
      localStorage.setItem('unrelated', 'x');
      const { accepted, skipped } = parse(serialize(localStorage, accepts), accepts);
      expect(accepted).to.deep.equal({ language: 'fr' });
      expect(skipped).to.deep.equal([]);
    });

    it('round trips values outside of latin1', () => {
      localStorage.setItem('language', 'Ünïcödé ✓ 日本');
      const { accepted } = parse(serialize(localStorage, accepts), accepts);
      expect(accepted.language).to.equal('Ünïcödé ✓ 日本');
    });

    it('exports readable JSON', () => {
      localStorage.setItem('language', 'fr');
      expect(JSON.parse(serialize(localStorage, accepts))).to.deep.equal({ language: 'fr' });
    });

    it('skips unrecognized keys and non-string values', () => {
      const data = JSON.stringify({ language: 'fr', allCards: '[]', chatRainbowDisabled: true });
      const { accepted, skipped } = parse(data, accepts);
      expect(accepted).to.deep.equal({ language: 'fr' });
      expect(skipped).to.have.members(['allCards', 'chatRainbowDisabled']);
    });

    it('rejects data that is not a settings export', () => {
      expect(() => parse('', accepts)).to.throw();
      expect(() => parse('not json', accepts)).to.throw();
      expect(() => parse('[]', accepts)).to.throw();
      expect(() => parse('"text"', accepts)).to.throw();
      expect(() => parse('null', accepts)).to.throw();
    });
  });
});
