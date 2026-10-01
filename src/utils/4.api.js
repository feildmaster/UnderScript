import {
  scriptVersion,
  window,
} from './1.variables.js';

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
  set(o, key, val, r) {
    if (key in o) return false;
    register(key, val, true);
    return Reflect.set(o, key, val, r);
  },
});

window.underscript = new Proxy(underscript, {
  get(...args) {
    const value = Reflect.get(...args);
    if (value === null || (typeof value !== 'object' && typeof value !== 'function')) return value;
    return new Proxy(value, { set() {} });
  },
  set() {},
});
