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

  return {
    get, set, peak,
  };
}
