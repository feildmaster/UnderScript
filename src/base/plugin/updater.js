import wrap from 'src/utils/2.pokemon.js';
import { registerModule } from 'src/utils/plugin.js';
import { registerPlugin } from 'src/hooks/updates.js';
import * as settings from 'src/utils/settings/index.js';
import Translation from 'src/structures/constants/translation.ts';

const text = Translation.Setting('update.plugin');
const setting = settings.register({
  name: text,
  key: 'underscript.disable.plugins.update',
  category: 'Plugins',
});

wrap(() => {
  const name = 'updater';
  function mod(plugin) {
    if (!plugin.version) return undefined;

    let updater = false;
    const update = plugin.settings().add({
      name: text,
      key: 'plugin.update',
      default: () => setting.value(),
      disabled: () => setting.value(),
      hidden: () => !updater,
    });
    setting.on(() => update.refresh());

    Object.defineProperty(plugin, 'canUpdate', {
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
