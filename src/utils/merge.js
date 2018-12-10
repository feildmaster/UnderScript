fn.merge = (...obj) => {
  const ret = {};
  if (obj) {
    obj.forEach((o) => {
      fn.each(o, (val, key) => {
        // TODO: How to handle arrays?
        ret[key] = typeof val === 'object' && !Array.isArray(val) ? fn.merge(ret[key], val) : val;
      });
    });
  }
  return ret;
};
