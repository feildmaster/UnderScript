wrap(() => {
  eventManager.on('@autocomplete', ({ list }) => {
    list.splice(0, 0, ...global('selfFriends')
      .map(fn.user.name)
      .filter((name) => !list.includes(name)));
  });
});
