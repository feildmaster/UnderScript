import { debug } from './debug.js';

const regex = /\B\/\/ ==UserScript==\r?\n([\S\s]*?)\r?\n\/\/ ==\/UserScript==/;

export default function extractMeta(text = '') {
  try {
    const [, rawMeta] = text.match(regex);
    const meta = rawMeta ? rawMeta.split(/[\r\n]/) : [];
    if (!Array.isArray(meta)) throw new Error('Invalid meta block');
    return meta.reduce((acc, line) => {
      if (!line) return acc;
      const [key, ...rest] = line.replace(/\/\/ @/, '').trim().split(/\s+/);
      const value = rest.join(' ');
      const current = acc[key];
      if (current === undefined) {
        acc[key] = value;
      } else if (!Array.isArray(current)) {
        acc[key] = [current, value];
      } else {
        current.push(value);
      }
      return acc;
    }, {});
  } catch (err) {
    console.error(err);
    debug(err, 'debugging.extractMeta');
    return null;
  }
}
