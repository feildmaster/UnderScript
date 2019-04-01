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
    top: true,
    note: () => {
      if (!canSurrender()) {
        return `You can't surrender before turn 5.`;
      }
    },
    action: () => {
      const socket = global('socketGame');
      if (socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify({action: "surrender"}));
    },
  });
});
