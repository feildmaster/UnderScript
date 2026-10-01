import { register } from 'node:module';
import { JSDOM } from 'jsdom';
import jQuery from 'jquery';

register('./loader.js', import.meta.url);

const { window } = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
  url: 'https://undercards.net/',
});

globalThis.window = window;
globalThis.document = window.document;
globalThis.localStorage = window.localStorage;
globalThis.$ = jQuery(window);
globalThis.GM_info = {
  script: { version: '0.0.0-test' },
  scriptHandler: 'test',
};
globalThis.fetch = () => Promise.reject(new Error('Unexpected fetch, stub it with mockFetch()'));
