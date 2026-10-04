import Translation from 'src/structures/constants/translation.ts';
import { infoToast } from 'src/utils/2.toasts.js';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import style from 'src/utils/style.js';

const setting = settings.register({
  name: Translation.Setting('large.avatar'),
  key: 'underscript.chat.largeIcons',
  default: true,
  page: 'Chat',
  onChange: update,
});

const styles = style.add();

function update() {
  if (styles) {
    styles.remove();
  }
  if (!setting.value()) {
    styles.append(
      '.chat-messages li.message-group .avatar, .chat-messages li.message-group .rainbowAvatar, .chat-messages li.message-group .avatarGroup { height: 24px; width: 24px }',
      '.chat-message-header { padding-left: 30px; }',
      '.chat-message { display: block; text-indent: 0 !important; }',
    );
  }
}

eventManager.on('ChatDetected', () => {
  update();

  const value = setting.value();
  const buttons = {
    text: value ? 'Revert it!' : 'Enable it!',
    onclick: (e) => {
      setting.set(!value);
    },
  };

  infoToast({
    text: `There's a Large Icon Mode chat setting`,
    className: 'dismissable',
    buttons,
  }, 'underscript.notice.largeIcons', '1');
});
