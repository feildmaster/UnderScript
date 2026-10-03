import { expect } from 'chai';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as flags from '../../src/utils/debugFlags.js';
import { debug, enabled } from '../../src/utils/debug.js';

const src = new URL('../../src', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');

describe('debug flags', () => {
  describe('registered flags', () => {
    const registered = flags.registeredFlags();

    it('have unique keys', () => {
      const keys = registered.map(({ key }) => key);
      expect(new Set(keys).size).to.equal(keys.length);
    });

    it('are all under debugging', () => {
      registered.forEach(({ key }) => expect(key).to.match(/^debugging(\.|$)/));
    });

    it('include every exported flag', () => {
      const exported = Object.values(flags).filter((value) => typeof value === 'object');
      expect(registered).to.have.members(exported);
    });

    it('describe themselves', () => {
      registered.forEach(({ description }) => expect(description).to.be.a('string').that.is.not.empty);
    });
  });

  describe('families', () => {
    it('derive a flag from a suffix', () => {
      expect(flags.rawChat('getMessage').key).to.equal('debugging.rawchat.getMessage');
      expect(flags.rawIgnoreEvent('getTurn').key).to.equal('debugging.raw.ignore.getTurn');
    });

    it('are not registered as settings', () => {
      const keys = flags.registeredFlags().map(({ key }) => key);
      expect(keys).to.not.include('debugging.rawchat');
      expect(keys).to.not.include('debugging.rawchat.getMessage');
      expect(keys).to.not.include('debugging.raw.ignore.getTurn');
    });
  });

  describe('debug', () => {
    const original = console.debug;
    let logged;

    beforeEach(() => {
      localStorage.clear();
      logged = [];
      console.debug = (...args) => logged.push(args);
    });

    afterEach(() => {
      console.debug = original;
    });

    it('stays quiet when the flag is off', () => {
      debug('message', flags.rawGame);
      expect(logged).to.deep.equal([]);
    });

    it('logs when the flag is on', () => {
      localStorage.setItem('debugging.raw.game', '1');
      debug('message', flags.rawGame, 'extra');
      expect(logged).to.deep.equal([['[debugging.raw.game]', 'message', 'extra']]);
    });

    it('treats true as on', () => {
      localStorage.setItem('debugging.raw.game', 'true');
      expect(enabled(flags.rawGame)).to.equal(true);
    });

    it('does not log for a different flag', () => {
      localStorage.setItem('debugging.raw.kill', '1');
      debug('message', flags.rawGame);
      expect(logged).to.deep.equal([]);
    });

    it('logs everything when the master flag is on', () => {
      localStorage.setItem('debugging.*', '1');
      debug('message', flags.rawGame);
      expect(logged).to.have.length(1);
    });

    it('uses the general flag by default', () => {
      localStorage.setItem('debugging', '1');
      debug('message');
      expect(logged).to.deep.equal([['[debugging]', 'message']]);
    });

    it('reads derived flags', () => {
      localStorage.setItem('debugging.rawchat.getMessage', '1');
      expect(enabled(flags.rawChat('getMessage'))).to.equal(true);
      expect(enabled(flags.rawChat('other'))).to.equal(false);
    });
  });

  describe('source', () => {
    it('never passes a flag as a string', () => {
      const offenders = readdirSync(src, { recursive: true })
        .filter((file) => file.endsWith('.js') && !file.endsWith('debugFlags.js'))
        .filter((file) => /['"`]debugging[.'"`*]/.test(readFileSync(join(src, file), 'utf8')));
      expect(offenders).to.deep.equal([]);
    });
  });
});
