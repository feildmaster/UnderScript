wrap(() => {
  const setting = settings.register({
    name: 'Add Tribe Outline',
    key: 'underscript.card.tribe.outline',
    page: 'Library',
    default: true,
    onChange: toggle,
    category: 'Outline',
  });
  const art = new VarStore();

  function toggle(add = setting.value()) {
    if (art.isSet()) {
      art.get().remove();
    }
    if (add) {
      art.set(style.add(
        '.cardTribes .tribe { color: rgb(0, 0, 0); filter: drop-shadow(0px 0px) drop-shadow(0px 0px); }',
      ));
    }
  }

  eventManager.on(':loaded', toggle);
});
