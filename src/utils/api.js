const api = wrap(() => {
  const underscript = window.underscript = {};

  function register(name, val) {
    if (underscript.hasOwnProperty(name)) throw new Error('Variable already exposed');

    underscript[name] = val;
  }

  return {
    register,
  };
});
