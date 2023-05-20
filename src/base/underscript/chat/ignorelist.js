import each from '../../../utils/each.js';
import eventManager from '../../../utils/eventManager.js';
import ignoreUser from '../../../utils/ignoreUser.js';

eventManager.on(':load', () => {
  each(localStorage, (name, key) => {
    if (!key.startsWith('underscript.ignore.')) return;
    ignoreUser(name, key);
  });
});
