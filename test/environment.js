import { expect } from 'chai';
import { jsonResponse, mockFetch } from './setup/fetch.js';

describe('test environment', () => {
  describe('localStorage', () => {
    it('stores values', () => {
      localStorage.setItem('key', 'value');
      expect(localStorage.getItem('key')).to.equal('value');
    });

    it('starts empty for every test', () => {
      expect(localStorage.length).to.equal(0);
    });
  });

  describe('fetch', () => {
    it('rejects until stubbed', async () => {
      let error;
      try {
        await fetch('https://example.com/');
      } catch (e) {
        error = e;
      }
      expect(error.message).to.contain('mockFetch');
    });

    it('answers with the stub and records calls', async () => {
      const calls = mockFetch(() => jsonResponse({ ok: true }));
      const response = await fetch('https://example.com/data');
      expect(await response.json()).to.deep.equal({ ok: true });
      expect(calls.map(({ input }) => input)).to.deep.equal(['https://example.com/data']);
    });

    it('is restored after each test', async () => {
      let error;
      try {
        await fetch('https://example.com/');
      } catch (e) {
        error = e;
      }
      expect(error.message).to.contain('mockFetch');
    });
  });
});
