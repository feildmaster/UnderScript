import wrap from 'src/utils/2.pokemon.js';
import { registerModule } from 'src/utils/plugin.js';
import { toast as basicToast, errorToast } from 'src/utils/2.toasts.js';
import toArray from 'src/utils/toArray.js';

wrap(() => {
  const name = 'toast';
  function pluginToast(plugin, toast) {
    toast.footer = `${plugin.name} • via UnderScript`;
    if (toast.error) return errorToast(toast);
    return basicToast(toast);
  }

  function mod(plugin) {
    let warned = false;
    return (data) => {
      const toast = typeof data === 'object' ? { ...data } : { text: data };
      if (!warned && (toast.css || toArray(toast.buttons).some((button) => button?.css))) {
        warned = true;
        plugin.logger.warn('toast(): `css` is deprecated, please use `className` instead.');
      }
      return pluginToast(plugin, toast);
    };
  }

  registerModule(name, mod, 'logger');
});
