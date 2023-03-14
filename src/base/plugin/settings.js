import * as settings from '../../utils/settings/index.js';
import wrap from '../../utils/2.pokemon.js';
import { registerModule } from '../../utils/plugin.js';
import SettingType from '../../utils/settings/types/setting.js';

wrap(() => {
  const name = 'settings';
  function add(plugin) {
    const prefix = `underscript.plugin.${plugin.name}`;

    return (data = {}) => {
      if (!data.key) throw new Error('Key must be provided');

      const setting = {
        ...data,
        key: `${prefix}.${data.key}`,
        name: data.name || data.key,
        page: plugin,
      };
      return settings.register(setting);
    };
  }

  function mod(plugin) {
    const obj = {
      add: add(plugin),
      on: (...args) => settings.on(...args),
      open: () => settings.open(plugin),
      isOpen: () => settings.isOpen(),
      addType(type) {
        if (!(type instanceof SettingType)) {
          plugin.logger.error('SettingType: Attempted to register object of:', typeof type);
          return;
        }
        if (!type.name.startsWith(`${plugin.name}:`)) {
          type.name = `${plugin.name}:${type.name}`;
        }
        settings.registerType(type, plugin.addStyle);
      },
    };
    return () => Object.freeze(obj);
  }

  registerModule(name, mod);
});
