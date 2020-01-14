wrap(() => {
  const name = 'toast';
  function mod(plugin, data) {
    const toast = typeof data === 'object' ? {...data} : { text: data, };
    toast.footer = `${plugin.name} • via UnderScript`;
    if (toast.error) return fn.errorToast(toast);
    return fn.toast(toast);
  }
  
  registerModule(name, mod);
});
