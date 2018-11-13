fn.each(localStorage, (name, key) => {
  if (!key.startsWith('underscript.ignore.')) return;
  settings.register({
    key, name,
    type: 'remove',
    page: 'ignorelist',
    category: 'Users',
  });
});

settings.setDisplayName('Ignore List', 'ignorelist');
