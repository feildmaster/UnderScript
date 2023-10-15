import * as api from './4.api.js';

const nameRegex = /^[a-z0-9 ]+$/i;
/**
 * @type Map<string, any>
 */
const registry = new Map();
const modules = [];

// TODO: RegisteredPlugin
export default function Plugin(name = '') {
  // eslint-disable-next-line no-param-reassign
  name = name.trim();
  if (name === '') throw new Error('Plugin must have a name');
  if (name.length > 20) throw new Error(`Plugin name too long (${name.length}/20)`);
  if (!nameRegex.test(name)) throw new Error('Name contains illegal characters');
  if (registry.has(name)) throw new Error('Name already registered');

  const methods = {
    name,
  };

  const local = [...modules];
  function load({ name: prop, mod, dependencies = [], runs = 0 }) {
    if (methods[prop] !== undefined) {
      console.error(`Skipping "${prop}": Already exists`);
      return;
    }
    const required = dependencies.filter((module) => methods[module] === undefined);
    if (required.length) {
      // eslint-disable-next-line no-param-reassign, no-plusplus
      if (runs++ < 5) local.push({ name: prop, mod, dependencies: required, runs });
      return;
    }
    try {
      const val = mod(methods);
      if (val !== undefined) {
        methods[prop] = val;
      }
    } catch (e) {
      console.error(`Error loading "${prop}":`, e);
    }
  }
  for (let i = 0; i < local.length; i++) {
    load(local[i]);
  }
  local.filter(({ runs = 0, dependencies = [] }) => runs === 5 && dependencies.length)
    .forEach(({ name: prop, dependencies }) => console.log(`Failed to load module: ${prop} [${dependencies.join(', ')}]`));

  const plugin = Object.freeze(methods);
  registry.set(name, plugin);
  return plugin;
}

api.register('plugin', Plugin);

export function registerModule(name, mod, dependencies) {
  if (!name) throw new Error('Module has no name');
  modules.push({ name, mod, dependencies });
}

export function getPluginNames() {
  return [...registry.keys()];
}
