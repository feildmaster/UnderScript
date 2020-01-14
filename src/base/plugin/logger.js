wrap(() => {
  const name = 'logger';
  function mod(plugin) {
    const obj = {};
    ['info', 'error', 'log', 'warn'].forEach((key) => {
      obj[key] = (...args) => console[key](
        `[%c${plugin.name}%c/${key}]`,
        'color: #436ad6;',
        'color: inherit;', ...args);
    });
    return Object.freeze(obj);
  }

  registerModule(name, mod);
});
