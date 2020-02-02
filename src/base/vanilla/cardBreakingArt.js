wrap(() => {
  const setting = settings.register({
    name: 'Disable Breaking Card Art',
    key: 'underscript.hide.breaking-skin',
    page: 'Library',
    onChange: toggle,
    category: 'Card Skins',
  });
  const art = new VarStore();

  function toggle() {
    if (art.isSet()) {
      art.get().remove();
    } else {
      art.set(style.add(
        '.breaking-skin .cardHeader, .breaking-skin .cardFooter { background-color: rgb(0, 0, 0); }',
        '.breaking-skin .cardImage { z-index: 1; }',
      ));
    }
  }

  eventManager.on(':loaded', () => {
    if (setting.value()) toggle();
  });
});
