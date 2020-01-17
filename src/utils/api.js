const api = wrap(() => {
  const underscript = {
    version: scriptVersion,
  };

  window.underscript = underscript;

  function register(name, val) {
    if (Object.prototype.hasOwnProperty.call(underscript, name)) throw new Error('Variable already exposed');

    underscript[name] = val;
  }

  return {
    register,
  };
});
