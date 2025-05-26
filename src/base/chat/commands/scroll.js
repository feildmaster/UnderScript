import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { debug } from 'src/utils/debug.js';
import Translation from 'src/structures/constants/translation.ts';

const command = 'scroll';
const setting = settings.register({
  name: Translation.DISABLE_COMMAND_SETTING.withArgs(command),
  key: `underscript.command.${command}`,
  note: `/${command}`,
  page: 'Chat',
  category: Translation.CATEGORY_CHAT_COMMAND,
});

eventManager.on('Chat:command', function process(data) {
  debug(data);
  if (this.canceled || data.command !== command || setting.value()) return;
  debug('Scroll command');
  this.canceled = true;
  global('scroll')($(`#${data.room}`), true);
});
