import wrap from '../../utils/2.pokemon.js';
import { registerModule } from '../../utils/plugin.js';
import { crafting, decks, filters } from '../library/filter.js';

wrap(() => {
  if (!(crafting || decks)) return;
  const name = 'addFilter';
  function mod(plugin) {
    return (filter) => {
      if (typeof filter !== 'function') throw new Error('Must pass a function');
      function customFilter(...args) {
        try {
          return filter.call(this, ...args);
        } catch (e) {
          plugin.logger.error('Failed to apply filter', e);
        }
        return undefined;
      }
      filters.push(customFilter);
    };
  }

  registerModule(name, mod);
});
