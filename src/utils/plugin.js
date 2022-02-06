import * as api from './4.api';

const nameRegex = /^[a-z0-9 ]+$/i;
const registry = new Map();
const modules = [];

// TODO: RegisteredPlugin

export default function Plugin(name = '') {
  name = name.trim();
  if (name === '') throw new Error('Plugin must have a name');
  if (name.length > 20) throw new Error(`Plugin name too long (${name.length}/20)`);
  if (!nameRegex.test(name)) throw new Error('Name contains illegal characters');
  if (registry.has(name)) throw new Error('Name already registered');

  const methods = {
    name,
  };

  modules.forEach(({ name: prop, mod }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (typeof methods[prop] !== 'undefined') {
      console.error(`Skipping "${prop}": Already exists`);
      return;
    }
    const val = mod(methods);
    if (val !== undefined) {
      methods[prop] = val;
    }
  });

  const plugin = Object.freeze(methods);

  registry.set(name, plugin);

  return plugin;
}

api.register('plugin', Plugin);

export function registerModule(name, mod) {
  modules.push({ name, mod });
}
