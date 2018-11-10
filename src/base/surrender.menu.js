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
    text: 'Surrender',
    enabled: canSurrender,
    close: true,
    note: () => {
      if (canSurrender()) return null;
      return `You can't surrender before turn 5.`;
    },
    action: () => {
      if (socket.readyState !== 1) return;
      socket.send(JSON.stringify({action: "surrender"}));
    },
  });
});
