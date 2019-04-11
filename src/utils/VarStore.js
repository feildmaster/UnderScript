function VarStore(def) {
  let v = def;

  function get() {
    const ret = v;
    set(null);
    return ret;
  }

  function peak() {
    return v;
  }

  function set(val) {
    const ret = v;
    v = val;
    return ret;
  }

  return {
    get, set, peak,
  };
}
