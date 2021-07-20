function VarStore(def) {
  let v = def;

  function get() {
    const ret = v;
    set(def);
    return ret;
  }

  function peak() {
    return v;
  }

  function set(val) {
    return v = val;
  }

  function isSet() {
    return v !== def;
  }

  const ret = {
    get, set, peak, isSet,
  };

  Object.defineProperty(ret, 'value', {
    get,
    set,
  });

  return ret;
}

api.module.utils.VarStore = Object.freeze(VarStore);
