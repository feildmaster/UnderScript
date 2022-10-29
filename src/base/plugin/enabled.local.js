import wrap from '../../utils/2.pokemon';
import { registerModule } from '../../utils/plugin';
import * as settings from '../../utils/settings';

const enable = ['Enable with toast', 'Enable silently'];

const setting = settings.register({
  name: 'New plugin behavior',
  key: 'enable.plugins',
  category: 'Plugins',
  data: [...enable, 'Disable with toast', 'Disable silently'],
  type: 'select',
});

wrap(() => {
  const name = 'enabled';

  function mod(plugin) {
    // if (!plugin.version) return;
    const enabled = plugin.settings().add({ key: 'Enabled', default: enable.includes(setting.value()) });

    Object.defineProperty(plugin, name, {
      get: () => !!enabled.value(), // TODO: Why does it not default to false?
    });

    const registered = plugin.settings().add({ key: 'registered', hidden: true });
    if (!registered.value()) {
      const val = enable.includes(setting.value());
      if (setting.value().includes('toast')) {
        // TODO: Show toast to toggle setting from default
      } else {
        registered.set(true);
      }
      // Set initial value
      enabled.set(val);
    }
  }

  registerModule(name, mod, ['settings']);
});
