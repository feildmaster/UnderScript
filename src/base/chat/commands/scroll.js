import eventManager from '../../../utils/eventManager.js';
import * as settings from '../../../utils/settings/index.js';
import { global } from '../../../utils/global.js';
import { debug } from '../../../utils/debug.js';

const command = 'scroll';
const setting = settings.register({
  name: `Disable ${command} command`,
  key: `underscript.command.${command}`,
  note: `/${command}`,
  page: 'Chat',
  category: 'Commands',
});

eventManager.on('Chat:command', function process(data) {
  debug(data);
  if (this.canceled || data.command !== command || setting.value()) return;
  debug('Scroll command');
  this.canceled = true;
  global('scroll')($(`#${data.room}`), true);
});
