import * as settings from '../../utils/settings';
import wrap from '../../utils/2.pokemon';
import { registerModule } from '../../utils/plugin';
import SettingType from '../../utils/settings/setting';

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
    return () => obj;
  }

  registerModule(name, mod);
});
