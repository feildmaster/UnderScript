import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import onPage from 'src/utils/onPage.js';
import rand from 'src/utils/rand.js';
import * as $el from 'src/utils/elementHelper.js';
import Translation from 'src/structures/constants/translation.js';

eventManager.on('ChatDetected', function goodGame() {
  const list = ['good game', 'gg', 'Good Game', 'Good game'];
  const command = 'gg';
  const setting = settings.register({
    name: Translation.DISABLE_COMMAND_SETTING.withArgs(command),
    key: `underscript.command.${command}`,
    note: `/${command}`,
    page: 'Chat',
    category: Translation.CATEGORY_CHAT_COMMAND,
  });

  if (!onPage('Game')) return;
  eventManager.on('Chat:command', function ggCommand(data) {
    if (this.canceled || data.command !== command || setting.value()) return;
    if (typeof gameId === 'undefined') {
      this.canceled = true; // Don't send text
      return;
    }
    data.output = `@${$el.text.get(document.querySelector('#enemyUsername'))} ${list[rand(list.length)]}`; // Change the output
  });
});
