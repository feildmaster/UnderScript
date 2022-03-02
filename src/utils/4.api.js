import { scriptVersion } from './1.variables';

const underscript = {
  version: scriptVersion,
};

const modules = {};

export function register(name, val, module = false) {
  // if (underscript.ready) throw new Error(`Registering module (${name}) too late!`);
  if (underscript[name]) {
    if (!module) throw new Error(`${name} already exists`);
    console.error(`Module [${name}] skipped, variable exists`);
    return;
  }

  underscript[name] = val;
}

export const mod = new Proxy(modules, {
  get(o, key, r) {
    if (!(key in o)) {
      const ob = {};
      Reflect.set(o, key, ob, r);
      register(key, ob, true);
    }
    return Reflect.get(o, key, r);
  },
  set() {},
});

window.underscript = new Proxy(underscript, {
  get(...args) {
    return Reflect.get(...args);
  },
  set() {},
});
