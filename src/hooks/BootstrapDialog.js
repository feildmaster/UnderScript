import eventManager from '../utils/eventManager.js';
import wrap from '../utils/2.pokemon.js';
import { window } from '../utils/1.variables.js';

function setter(key, args) {
  const original = args[`on${key}`];
  function wrapper(dialog) {
    let ret;
    if (typeof original === 'function') {
      ret = wrap(() => original(dialog), `BootstrapDialog:on${key}`);
    }
    eventManager.emit(`BootstrapDialog:${key}`, dialog);
    return ret;
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
    return (o = {}) => {
      const ret = new R(o);
      if (eventManager.cancelable.emit('BootstrapDialog:preshow', ret).canceled) {
        return ret;
      }
      return ret.open();
    };
  }
  return Reflect.get(target, prop, R);
}

eventManager.on(':preload', () => {
  if (window.BootstrapDialog) {
    window.BootstrapDialog = new Proxy(window.BootstrapDialog, { construct, get });
  }
});
