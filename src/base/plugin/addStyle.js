import wrap from '../../utils/2.pokemon.js';
import { newStyle } from '../../utils/style.js';
import { registerModule } from '../../utils/plugin.js';

wrap(() => {
  const name = 'addStyle';
  let style;

  function getStyle(plugin) { // Lazy initialize style, so as to not clutter the dom
    if (!style) {
      style = newStyle(plugin);
    }
    return style;
  }

  function mod(plugin) {
    return (...styles) => getStyle(plugin.name).add(...styles);
  }

  registerModule(name, mod);
});
