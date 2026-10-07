import wrap from 'src/utils/2.pokemon.js';
import { registerModule } from 'src/utils/plugin.js';
import { toast as basicToast, errorToast } from 'src/utils/2.toasts.js';
import toArray from 'src/utils/toArray.js';

wrap(() => {
  const buildFooter = (plugin, text) => [text, plugin.name, 'via UnderScript'].filter(Boolean).join(' • ');
  const name = 'toast';
  /**
   * @param {*} plugin
   * @param {import('simpletoast').SimpleToastOptions} options
   * @returns {import('simpletoast').SimpleToastHandle}
   */
  function pluginToast(plugin, options) {
    const footer = buildFooter(plugin, options.footer);
    const toast = { ...options, footer };
    if (toast.error) return errorToast(toast);
    return basicToast(toast);
  }

  function mod(plugin) {
    let warned = false;
    return (data) => {
      const options = typeof data === 'object' ? { ...data } : { text: data };
      if (!warned && (options.css || toArray(options.buttons).some((button) => button?.css))) {
        warned = true;
        plugin.logger.warn('toast(): `css` is deprecated, please use `className` instead.');
      }
      const toast = pluginToast(plugin, options);
      if (!toast.exists()) return toast;
      const { setFooter } = toast;
      toast.setFooter = (text) => setFooter(buildFooter(plugin, text));
      return toast;
    };
  }

  registerModule(name, mod, 'logger');
});
