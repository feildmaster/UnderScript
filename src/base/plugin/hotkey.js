import wrap from '../../utils/2.pokemon';
import { registerModule } from '../../utils/plugin';
import Hotkey from '../../utils/hotkey.class';
import { hotkeys } from '../../utils/1.variables';

class PluginHotkey extends Hotkey {
  constructor(plugin, hotkey) {
    super();
    this.plugin = plugin;
    this.hotkey = hotkey;
  }

  get name() {
    return `[${this.hotkey.name}]`;
  }

  get keys() {
    return this.hotkey.keys;
  }

  get clicks() {
    return this.hotkey.clicks;
  }

  run(...args) {
    try {
      return this.hotkey.run(...args);
    } catch (e) {
      this.plugin.logger.error(`Hotkey${this.name || ''}${e instanceof Error ? '' : ' Error:'}`, e);
    }
    return undefined;
  }
}

wrap(() => {
  const name = 'hotkey';
  function mod(plugin) {
    const registry = new Map();
    return {
      register(hotkey) {
        validate(hotkey);
        if (registry.has(hotkey)) return;
        const wrapper = new PluginHotkey(plugin, hotkey);
        registry.set(hotkey, wrapper);
        hotkeys.push(wrapper);
      },
      unregister(hotkey) {
        validate(hotkey);
        const wrapper = registry.get(hotkey);
        if (!wrapper) return;
        registry.delete(hotkey);
        hotkeys.splice(hotkeys.indexOf(wrapper), 1);
      },
    };
  }

  registerModule(name, mod);
});

function validate(hotkey) {
  if (!(hotkey instanceof Hotkey)) throw new Error('Not valid hotkey');
}
