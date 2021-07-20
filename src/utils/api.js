const api = wrap(() => {
  const underscript = {
    version: scriptVersion,
  };

  const modules = {};

  window.underscript = underscript;

  function register(name, val) {
    if (Object.prototype.hasOwnProperty.call(underscript, name)) throw new Error('Variable already exposed');

    underscript[name] = val;
  }

  function finalize() {
    if (finalize.true) return;
    fn.each(modules, (module, key) => {
      if (underscript[key]) {
        console.error(`Module [${key}] skipped, variable exists`);
        return;
      }
      register(key, Object.freeze(module));
    });
    register('ready', true);
    window.underscript = Object.freeze(underscript);
  }

  return {
    register,
    module: new Proxy(modules, {
      get(o, key, r) {
        if (!(key in o)) {
          Reflect.set(o, key, {}, r);
        }
        return Reflect.get(o, key, r);
      },
    }),
    finalize,
  };
});
