onPage('Game', () => {
  // Unbind the "surrender" hotkey
  eventManager.on('jQuery', () => {
    $(document).off('keyup');
  });
  function canSurrender() {
    return turn >= 5;
  }
  // Add the "surrender" menu button
  menu.addButton({
    name: 'Surrender',
    enabled: canSurrender,
    note: () => {
      if (canSurrender()) return null;
      return `You can't surrender before turn 5.`;
    },
  });
});
