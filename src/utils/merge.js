import each from './each.js';

export default function merge(...obj) {
  const ret = {};
  if (obj) {
    obj.forEach((o) => {
      each(o, (val, key) => {
        // TODO: How to handle arrays?
        ret[key] = Object.getPrototypeOf(val) === Object.prototype ? merge(ret[key], val) : val;
      });
    });
  }
  return ret;
}
