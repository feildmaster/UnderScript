wrap(() => {
  const nameRegex = /^[a-z0-9 ]+$/i;
  const registry = new Map();

  function Plugin(name = '') {
    name = name.trim();
    if (name === '') throw new Error('Plugin must have a name');
    if (name.length > 20) throw new Error(`Plugin name too long (${name.length}/20)`);
    if (!nameRegex.test(name)) throw new Error('Name contains illegal characters');
    if (registry.has(name)) throw new Error('Name already registered');

    const plugin = Object.freeze({
      name, 
      toast: (data) => toast(plugin, data),
      //menu: Object.freeze({}),
      //settings: Object.freeze({}),
      //logger: Object.freeze({}),
      //events: Object.freeze({}),
    });

    registry.set(name, plugin);

    return plugin;
  }

  api.register('plugin', Plugin);

  function toast(plugin, data) {
    const toast = typeof data === 'object' ? {...data} : { text: data, };
    toast.footer = `${plugin.name} • via UnderScript`;
    if (toast.error) return fn.errorToast(toast);
    return fn.toast(toast);
  }
});
