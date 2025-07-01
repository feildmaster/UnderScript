import wrap from 'src/utils/2.pokemon.js';
import { newStyle } from 'src/utils/style.js';
import { registerModule } from 'src/utils/plugin.js';

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
    return (...styles) => getStyle(plugin).add(...styles);
  }

  registerModule(name, mod);
});
