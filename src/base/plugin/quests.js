import wrap from 'src/utils/2.pokemon.js';
import { registerModule } from 'src/utils/plugin.js';
import { getQuests, fetch } from 'src/utils/quests.js';

wrap(() => {
  const name = 'quests';
  function mod(plugin) {
    return {
      getQuests,
      update(event = false) {
        return new Promise((res, rej) => {
          fetch(({ error, ...rest }) => {
            if (error) {
              rej(error);
            } else {
              res({ ...rest });
            }
          }, event);
        });
      },
    };
  }

  registerModule(name, mod);
});
