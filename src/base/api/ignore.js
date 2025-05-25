import * as settings from 'src/utils/settings/index.js';
import * as api from 'src/utils/4.api.js';
import ignoreUser from 'src/utils/ignoreUser.js';

const ignorePrefix = 'underscript.ignore.';

function ignore(user) {
  const name = user.username || user.name;
  const id = user.id || user.idUser;
  if (!name || !id) throw new Error('Invalid user');
  if (isIgnored(user)) return;
  const key = `${ignorePrefix}${id}`;
  ignoreUser(name, key, true);
}

function unignore(user) {
  const name = user.username || user.name;
  const id = user.id || user.idUser;
  if (!name || !id) throw new Error('Invalid user');
  const key = `${ignorePrefix}${id}`;
  settings.remove(key);
}

function isIgnored(user) {
  const name = user.username || user.name;
  const id = user.id || user.idUser;
  if (!name || !id) throw new Error('Invalid user');
  const key = `${ignorePrefix}${id}`;
  return !!settings.value(key);
}

const user = api.mod.user;
user.ignore = ignore;
user.unIgnore = unignore;
user.isIgnored = isIgnored;
