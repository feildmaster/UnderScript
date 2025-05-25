import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { infoToast } from 'src/utils/2.toasts.js';

const setting = settings.register({
  name: 'Disable Broadcast Toast',
  key: 'underscript.disable.broadcast',
  page: 'Chat',
});

eventManager.on('Chat:getMessageBroadcast', function broadcast({ message }) {
  if (setting.value()) return;
  infoToast({
    title: '[INFO] Undercards Broadcast Message',
    text: `<span style="color: #ff00ff;">${message}</span>`,
    footer: 'info-chan via UnderScript',
  });
});
