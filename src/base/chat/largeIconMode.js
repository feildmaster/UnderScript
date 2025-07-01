import Translation from 'src/structures/constants/translation';
import { buttonCSS as css } from 'src/utils/1.variables.js';
import { infoToast } from 'src/utils/2.toasts.js';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import style from 'src/utils/style.js';

const setting = settings.register({
  name: Translation.Setting('large.avatar'),
  key: 'underscript.chat.largeIcons',
  data: { reverse: true },
  page: 'Chat',
  onChange: update,
});

const styles = style.add();

function update() {
  if (styles) {
    styles.remove();
  }
  if (setting.value()) {
    styles.append(
      '.message-group { clear: both; }',
      '.chat-messages .avatarGroup { float: left; padding-right: 10px; }',
      '.chat-messages li .avatar, .chat-messages li .rainbowAvatar { height: 45px; }',
      '.chat-message { display: block; }',
    );
  }
}

eventManager.on('ChatDetected', () => {
  update();

  const value = setting.value();
  const buttons = {
    text: value ? 'Revert it!' : 'Enable it!',
    className: 'dismiss',
    css,
    onclick: (e) => {
      setting.set(!value);
    },
  };

  infoToast({
    text: `There's a new Large Icon mode setting for chat`,
    className: 'dismissable',
    buttons,
  }, 'underscript.notice.largeIcons', '1');
});
