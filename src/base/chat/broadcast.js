import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { infoToast } from '../../utils/2.toasts';

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
