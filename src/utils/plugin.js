import * as api from './4.api.js';

const nameRegex = /^[a-z0-9 ]+$/i;
/**
 * @type Map<string, any>
 */
const registry = new Map();
const modules = [];

function load({ name, mod, dependencies = [], runs = 0 }, methods, local) {
  if (methods[name] !== undefined) {
    console.error(`Skipping "${name}": Already exists`);
    return;
  }
  const required = dependencies.filter((module) => methods[module] === undefined);
  if (required.length) {
    if (runs < 5) local.push({ name, mod, dependencies: required, runs: runs + 1 });
    return;
  }
  try {
    const val = mod(methods);
    if (val !== undefined) {
      methods[name] = val;
    }
  } catch (e) {
    console.error(`Error loading "${name}":`, e);
  }
}

// TODO: RegisteredPlugin
export default function Plugin(name = '') {
  if (name.length > 20) throw new Error(`Plugin name too long (${name.length}/20)`);
  if (!nameRegex.test(name)) throw new Error('Name contains illegal characters');
  if (registry.has(name)) throw new Error('Name already registered');

  const methods = {
    name,
  };

  const local = [...modules];
  for (let i = 0; i < local.length; i++) {
    load(local[i], methods, local);
  }
  local.filter(({ runs = 0, dependencies = [] }) => runs === 5 && dependencies.length)
    .forEach(({ name: prop, dependencies }) => console.log(`Failed to load module: ${prop} [${dependencies.join(', ')}]`));

  const plugin = Object.freeze(methods);
  registry.set(name, plugin);
  return plugin;
}

api.register('plugin', (name) => {
  if (typeof name !== 'string' || !name.trim()) throw new Error('Plugin must have a name');
  return Plugin(name.trim());
});

export function registerModule(name, mod, dependencies) {
  if (!name) throw new Error('Module has no name');
  modules.push({ name, mod, dependencies });
}

export function getPluginNames() {
  return [...registry.keys()];
}
