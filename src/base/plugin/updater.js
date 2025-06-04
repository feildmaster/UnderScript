import wrap from 'src/utils/2.pokemon.js';
import { registerModule } from 'src/utils/plugin.js';
import { registerPlugin } from 'src/hooks/updates';
import * as settings from 'src/utils/settings/index.js';

// TODO: translation
const setting = settings.register({
  name: 'Disable Auto Updates',
  key: 'underscript.disable.plugins.update',
  category: 'Plugins',
});

wrap(() => {
  const name = 'updater';
  function mod(plugin) {
    if (!plugin.version) return undefined;

    let updater = false;
    const update = plugin.settings().add({
      name: 'Disable Auto Updates',
      key: 'plugin.update',
      default: () => setting.value(),
      disabled: () => setting.value(),
      hidden: () => !updater,
    });
    setting.on(() => update.refresh());

    Object.assign(plugin, 'canUpdate', {
      get: () => updater && !setting.value() && !update.value(),
    });

    return (data = {}) => {
      if (!['string', 'object'].includes(typeof data)) throw new Error();
      if (updater) throw new Error('Already registered');
      const {
        downloadURL = typeof data === 'string' ? data : undefined,
        updateURL,
      } = data;
      updater = registerPlugin(plugin, { downloadURL, updateURL });
      return () => {
        updater();
        updater = false;
      };
    };
  }

  registerModule(name, mod, 'events', 'settings');
});
