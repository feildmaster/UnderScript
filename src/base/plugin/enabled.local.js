import Translation from 'src/structures/constants/translation.ts';
import { buttonCSS as css } from 'src/utils/1.variables.js';
import wrap from 'src/utils/2.pokemon.js';
import { registerModule } from 'src/utils/plugin.js';
import * as settings from 'src/utils/settings/index.js';

// TODO: translation
const enable = ['Enabled with toast', 'Enabled silently'];

const setting = settings.register({
  // TODO: translation
  name: 'New plugin behavior',
  key: 'underscript.plugins.init',
  category: 'Plugins',
  // TODO: translation
  data: [...enable, 'Disabled with toast', 'Disabled silently'],
  type: 'select',
});

wrap(() => {
  const name = 'enabled';

  function mod(plugin) {
    if (!plugin.version) return;
    const enabled = plugin.settings().add({
      key: 'plugin.enabled',
      // TODO: translation
      name: 'Enabled',
      default: enable.includes(setting.value()),
    });

    Object.defineProperty(plugin, name, {
      get: () => enabled.value(),
    });

    const registered = plugin.settings().add({ key: 'plugin.registered', hidden: true });
    if (registered.value()) return;
    if (!setting.value().includes('toast')) {
      registered.set(true);
      return;
    }

    plugin.events.on(':load', () => {
      const isEnabled = enabled.value();
      plugin.toast({
        // TODO: translation
        title: 'New Plugin Detected',
        text: `"${plugin.name}" has been <span class="${isEnabled ? 'green' : 'gray'}">${isEnabled ? 'enabled' : 'disabled'}</span> by default.`,
        error: true, // Make it red.
        className: {
          toast: 'dismissable',
          button: 'dismiss',
        },
        buttons: [{
          text: Translation.General(isEnabled ? 'disable' : 'enable'),
          css,
          onclick() {
            enabled.set(!isEnabled);
            registered.set(true);
          },
        }, {
          text: Translation.DISMISS,
          css,
          onclick() {
            enabled.set(isEnabled);
            registered.set(true);
          },
        }],
      });
    });
  }

  registerModule(name, mod, ['settings', 'events']);
});
