function VarStore() {
  let v = null;

  function get() {
    const ret = v;
    set(null);
    return ret;
  }

  function set(val) {
    v = val;
  }

  return {
    get, set
  };
}
