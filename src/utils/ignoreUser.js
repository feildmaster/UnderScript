fn.ignoreUser = (name, key) => {
  settings.register({
    key, name,
    type: 'remove',
    page: 'Chat',
    category: 'Ignored Users',
  });
};
