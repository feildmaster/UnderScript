import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { infoToast } from 'src/utils/2.toasts.js';
import Translation from 'src/structures/constants/translation';

const command = 'spectate';
const setting = settings.register({
  name: Translation.DISABLE_COMMAND_SETTING.withArgs(command),
  key: 'underscript.command.spectate',
  note: '/spectate [text (optional)]<br/>Output:<br/>You vs Enemy: url [text]',
  page: 'Chat',
  category: Translation.CATEGORY_CHAT_COMMAND,
});

let toast;
eventManager.on('Chat:command', function spectateCommand(data) {
  if (this.canceled || data.command !== command || setting.value()) return;
  if (typeof gameId === 'undefined' || global('finish')) {
    this.canceled = true;
    return;
  }
  if (toast) toast.close();
  data.output = `${$('#yourUsername').text()} vs ${$('#enemyUsername').text()}: ${location.origin}/Spectate?gameId=${global('gameId')}&playerId=${global('userId')}${data.text ? ` - ${data.text}` : ''}`;
});

eventManager.on('GameStart', () => {
  toast = infoToast({
    text: 'You can send a spectate URL in chat by typing /spectate',
    onClose() {
      toast = null;
    },
  }, 'underscript.notice.spectatecommand', '1');
});
