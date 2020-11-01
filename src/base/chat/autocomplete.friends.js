wrap(() => {
  const setting = settings.register({
    name: 'Autocomplete: Online Friends Only',
    key: 'underscript.autocomplete.friends.online',
    page: 'Chat',
  });

  eventManager.on('@autocomplete', ({ list }) => {
    list.splice(0, 0, ...global('selfFriends')
      .filter(({ online }) => !setting.value() || online)
      .map(fn.user.name)
      .filter((name) => !list.includes(name)));
  });
});
