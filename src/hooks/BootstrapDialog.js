wrap(() => {
  function setter(key, args) {
    const original = args[`on${key}`];
    function wrapper(dialog) {
      if (typeof original === 'function') {
        original(dialog);
      }
      eventManager.emit(`BootstrapDialog:${key}`, dialog);
    }
    return wrapper;
  }

  function construct(Target, [args = {}]) {
    const obj = new Target({
      ...args,
      onshow: setter('show', args),
      onshown: setter('shown', args),
      onhide: setter('hide', args),
      onhidden: setter('hidden', args),
    });
    eventManager.emit('BootstrapDialog:create', obj);
    return obj;
  }

  function get(target, prop, R) {
    if (prop === 'show') {
      return (o = {}) => new R(o).open();
    }
    return Reflect.get(target, prop, R);
  }

  eventManager.on(':load', () => {
    if (window.BootstrapDialog) {
      window.BootstrapDialog = new Proxy(window.BootstrapDialog, { construct, get });
    }
  });
});
