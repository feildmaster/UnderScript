import each from './each.js';
import isSimpleObject from './isSimpleObject.js';

export default function merge(...obj) {
  const ret = {};
  if (obj) {
    obj.forEach((o) => {
      each(o, (val, key) => {
        // TODO: How to handle arrays?
        ret[key] = isSimpleObject(val) ? merge(ret[key], val) : val;
      });
    });
  }
  return ret;
}
