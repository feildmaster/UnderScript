import wrap from 'src/utils/2.pokemon.js';
import { registerModule } from 'src/utils/plugin.js';
import { crafting, decks, filters } from '../library/filter.js';

wrap(() => {
  if (!(crafting || decks)) return;
  const name = 'addFilter';
  let counter = 0;
  function mod(plugin) {
    return (filter) => {
      if (typeof filter !== 'function') throw new Error('Must pass a function');
      counter += 1;
      const functionName = filter.displayName || filter.name || `filter${counter}`;
      function customFilter(...args) {
        try {
          return filter.call(this, ...args);
        } catch (e) {
          plugin.logger.error(`Failed to apply filter [${functionName}]`, e);
        }
        return undefined;
      }
      customFilter.displayName = `${plugin.name}:${functionName}`;
      filters.push(customFilter);
    };
  }

  registerModule(name, mod);
});
