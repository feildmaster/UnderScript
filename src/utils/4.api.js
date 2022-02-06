import { scriptVersion } from './1.variables';
import each from './each';
import eventManager from './eventManager';

const underscript = {
  version: scriptVersion,
};

const modules = {};

export function register(name, val) {
  if (underscript.ready) throw new Error('Registering module too late!');
  if (Object.prototype.hasOwnProperty.call(underscript, name)) throw new Error('Variable already exposed');

  underscript[name] = val;
}

function finalize() {
  if (underscript.ready) return;
  each(modules, (module, key) => {
    if (underscript[key]) {
      console.error(`Module [${key}] skipped, variable exists`);
      return;
    }
    register(key, Object.freeze(module));
  });
  register('ready', true);
  window.underscript = Object.freeze(underscript);
}

export const mod = new Proxy(modules, {
  get(o, key, r) {
    if (!(key in o)) {
      Reflect.set(o, key, {}, r);
    }
    return Reflect.get(o, key, r);
  },
});

eventManager.on(':ready', finalize);
