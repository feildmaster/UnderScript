import each from '../utils/each';
import eventManager from '../utils/eventManager';
import ignoreUser from '../utils/ignoreUser';

eventManager.on(':load', () => {
  each(localStorage, (name, key) => {
    if (!key.startsWith('underscript.ignore.')) return;
    ignoreUser(name, key);
  });
});
