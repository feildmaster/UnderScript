wrap(() => {
  const setting = settings.register({
    name: 'Disable Full Card Art',
    key: 'underscript.hide.full-skin',
    page: 'Library',
    onChange: toggle,
  });
  let art;

  function toggle() {
    if (art) {
      art.remove();
      art = undefined;
    } else {
      art = style.add(
        '.full-skin .cardHeader, .full-skin .cardFooter { background-color: rgb(0, 0, 0); }',
      );
    }
  }

  eventManager.on(':loaded', () => {
    if (setting.value()) toggle();
  });
});
