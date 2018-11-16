fn.each(localStorage, (name, key) => {
  if (!key.startsWith('underscript.ignore.')) return;
  fn.ignoreUser(name, key);
});
