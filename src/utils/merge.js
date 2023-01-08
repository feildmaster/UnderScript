import each from './each.js';

export default function merge(...obj) {
  const ret = {};
  if (obj) {
    obj.forEach((o) => {
      each(o, (val, key) => {
        // TODO: How to handle arrays?
        ret[key] = typeof val === 'object' && !Array.isArray(val) ? merge(ret[key], val) : val;
      });
    });
  }
  return ret;
}
