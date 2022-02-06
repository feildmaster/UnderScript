import each from '../utils/each';
import ignoreUser from '../utils/ignoreUser';

each(localStorage, (name, key) => {
  if (!key.startsWith('underscript.ignore.')) return;
  ignoreUser(name, key);
});
