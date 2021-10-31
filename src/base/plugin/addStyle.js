wrap(() => {
  const name = 'addStyle';
  let style;

  function getStyle(plugin) { // Lazy initialize style, so as to not clutter the dom
    if (!style) {
      style = fn.style(plugin);
    }
    return style;
  }

  function mod(plugin) {
    return (...styles) => getStyle(plugin.name).add(...styles);
  }

  registerModule(name, mod);
});
