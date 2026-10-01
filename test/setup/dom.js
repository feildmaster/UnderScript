import { register } from 'node:module';
import { JSDOM } from 'jsdom';
import jQuery from 'jquery';

register('./loader.js', import.meta.url);

const { window } = new JSDOM('<!doctype html><html><head></head><body></body></html>');

globalThis.window = window;
globalThis.document = window.document;
globalThis.$ = jQuery(window);
globalThis.GM_info = {
  script: { version: '0.0.0-test' },
  scriptHandler: 'test',
};
