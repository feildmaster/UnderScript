settings.register({
  name: 'Disable Ignore Chat',
  key: 'underscript.disable.ignorechat',
  page: 'ignorelist',
  disabled: true,
});

settings.register({
  name: 'Ignore Behavior',
  key: 'underscript.ignorechat.how',
  type: 'select',
  options: ['remove', 'bulk', 'hide'],
  page: 'ignorelist',
  disabled: true,
});

Object.keys(localStorage).forEach((key) => {
  if (!key.startsWith('underscript.ignore.')) return;
  settings.register({
    key,
    name: localStorage.getItem(key),
    type: 'remove',
    page: 'ignorelist',
  });
});

settings.setDisplayName('Ignore List', 'ignorelist');
