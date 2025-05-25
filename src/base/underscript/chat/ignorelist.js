import each from 'src/utils/each.js';
import eventManager from 'src/utils/eventManager.js';
import ignoreUser from 'src/utils/ignoreUser.js';

eventManager.on(':load', () => {
  each(localStorage, (name, key) => {
    if (!key.startsWith('underscript.ignore.')) return;
    ignoreUser(name, key);
  });
});
