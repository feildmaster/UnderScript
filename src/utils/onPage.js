import wrap from './2.pokemon.js';
import * as api from './4.api.js';

export function getPageName() {
  const { pathname } = location;
  const length = pathname.length;
  let temp = pathname.indexOf('.');
  // eslint-disable-next-line no-cond-assign
  if (temp === -1 && (temp = pathname.lastIndexOf('/')) <= 0) {
    temp = null;
  }
  return pathname.substring(1, temp || length);
}

export default function onPage(name, callback, prefix) {
  const r = getPageName() === name;
  if (typeof callback === 'function' && r) {
    wrap(callback, prefix);
  }
  return r;
}

api.register('onPage', onPage);
