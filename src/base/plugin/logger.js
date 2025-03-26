import wrap from '../../utils/2.pokemon.js';
import { registerModule } from '../../utils/plugin.js';

wrap(() => {
  const name = 'logger';
  function mod(plugin) {
    const obj = {};
    ['info', 'error', 'log', 'warn', 'debug'].forEach((key) => {
      obj[key] = (...args) => console[key]( // eslint-disable-line no-console
        `[%c${plugin.name}%c/${key}]`,
        'color: #436ad6;',
        'color: inherit;',
        ...args,
      );
    });
    return Object.freeze(obj);
  }

  registerModule(name, mod);
});
