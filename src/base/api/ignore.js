wrap(() => {
  const ignorePrefix = 'underscript.ignore.';

  function ignore(user) {
    const name = user.username || user.name;
    const id = user.id || user.idUser;
    if (!name || !id) throw new Error('Invalid user');
    if (isIgnored(user)) return;
    const key = `${ignorePrefix}${id}`;
    fn.ignoreUser(name, key);
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

  const user = api.module.user;
  user.ignore = ignore;
  user.unIgnore = unignore;
  user.isIgnored = isIgnored;
});
