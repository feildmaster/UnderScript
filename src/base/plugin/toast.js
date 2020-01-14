wrap(() => {
  const name = 'toast';
  function toast(plugin, data) {
    const toast = typeof data === 'object' ? {...data} : { text: data, };
    toast.footer = `${plugin.name} • via UnderScript`;
    if (toast.error) return fn.errorToast(toast);
    return fn.toast(toast);
  }

  function mod(plugin) {
    return (data) => toast(plugin, data);
  }
  
  registerModule(name, mod);
});
