import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { infoToast } from 'src/utils/2.toasts.js';
import Translation from 'src/structures/constants/translation';

const setting = settings.register({
  name: Translation.Setting('autocomplete'),
  key: 'underscript.disable.broadcast',
  page: 'Chat',
});

eventManager.on('Chat:getMessageBroadcast', function broadcast({ message }) {
  if (setting.value()) return;
  infoToast({
    title: Translation.Toast('broadcast'),
    text: `<span style="color: #ff00ff;">${message}</span>`,
    footer: 'info-chan via UnderScript',
  });
});
