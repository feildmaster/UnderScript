wrap(() => {
  style.add(
    '.navbar.navbar-default.sticky { position: sticky; top: 0; z-index: 5; -webkit-transform: translateZ(0); transform: translateZ(0); }',
  );

  const setting = settings.register({
    name: 'Disable header scrolling',
    key: 'underscript.disable.header.scrolling',
    onChange: (to) => {
      toggle(!to);
    }
  });

  eventManager.on(':loaded', () => {
    toggle(!setting.value());
  });

  function toggle(val) {
    if (onPage('Decks')) return;
    const el = document.querySelector('.navbar.navbar-default');
    if (!el) return;
    el.classList.toggle('sticky', val);
  }
});
