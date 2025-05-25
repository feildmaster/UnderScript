import wrap from 'src/utils/2.pokemon.js';
import { registerModule } from 'src/utils/plugin.js';
import { toast as basicToast, errorToast } from 'src/utils/2.toasts.js';

wrap(() => {
  const name = 'toast';
  function pluginToast(plugin, data) {
    const toast = typeof data === 'object' ? { ...data } : { text: data };
    toast.footer = `${plugin.name} • via UnderScript`;
    if (toast.error) return errorToast(toast);
    return basicToast(toast);
  }

  function mod(plugin) {
    return (data) => pluginToast(plugin, data);
  }

  registerModule(name, mod);
});
