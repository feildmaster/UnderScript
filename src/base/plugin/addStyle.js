import wrap from 'src/utils/2.pokemon.js';
import { newStyle } from 'src/utils/style.js';
import { registerModule } from 'src/utils/plugin.js';

wrap(() => {
  const name = 'addStyle';

  function mod(plugin) {
    const style = newStyle(plugin);
    return (...styles) => style.add(...styles);
  }

  registerModule(name, mod);
});
