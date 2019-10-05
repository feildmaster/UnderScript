wrap(() => {
  if (onPage('Decks')) return;
  style.add(
    '.navbar.navbar-default { position: sticky; top: 0; z-index: 1; }',
  );
});
