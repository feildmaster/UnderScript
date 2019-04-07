eventManager.on('ChatDetected', function goodGame() {
  const list = ['good game'];
  const command = 'gg';
  const setting = settings.register({
    name: `Disable ${command} command`,
    key: `underscript.command.${command}`,
    note: `/${command}`,
    page: 'Chat',
    category: 'Commands',
  });

  if (!onPage('Game')) return;
  eventManager.on('Chat:command', function(data) {
    if (this.canceled || data.command !== command || setting.value()) return;
    if (typeof gameId === 'undefined' || global('finish')) {
      this.canceled = true; // Don't send text
      return;
    }
    this.output = `@${$el.text.get('#enemyUsername')} ${list[fn.rand(list.length)]}`; // Change the output
  });
});
