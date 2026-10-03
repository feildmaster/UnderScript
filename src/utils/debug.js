import { all, general } from './debugFlags.js';

/**
 * @param {unknown} message
 * @param {import('./debugFlags.js').DebugFlag} [flag]
 * @param {...unknown} extras
 */
export function debug(message, flag = general, ...extras) {
  if (!enabled(flag)) return;
  console.debug(`[${flag.key}]`, message, ...extras);
}

/**
 * @param {import('./debugFlags.js').DebugFlag} flag
 * @returns {boolean}
 */
export function enabled(flag) {
  return value(flag.key) || value(all.key);
}

function value(key) {
  const val = localStorage.getItem(key);
  return val === '1' || val === 'true';
}
