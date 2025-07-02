import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { infoToast } from 'src/utils/2.toasts.js';
import Hotkey from 'src/utils/hotkey.class.js';
import { buttonCSS as css, hotkeys } from 'src/utils/1.variables.js';
import { BUTTON as MOUSE_BUTTON } from 'src/utils/mouse.js';
import Translation from 'src/structures/constants/translation.ts';

const fullDisable = settings.register({
  name: Translation.Setting('endTurn'),
  key: 'underscript.disable.endTurn',
  page: 'Game',
  category: Translation.CATEGORY_HOTKEYS,
  onChange() {
    /* eslint-disable no-use-before-define */
    spaceDisable.refresh();
    mouseDisable.refresh();
    /* eslint-enable */
  },
});
const spaceDisable = settings.register({
  name: Translation.Setting('endTurn.keyboard'),
  key: 'underscript.disable.endTurn.space',
  disabled: () => fullDisable.value(),
  page: 'Game',
  category: Translation.CATEGORY_HOTKEYS,
});
const mouseDisable = settings.register({
  name: Translation.Setting('endTurn.mouse'),
  key: 'underscript.disable.endTurn.middleClick',
  disabled: () => fullDisable.value(),
  page: 'Game',
  category: Translation.CATEGORY_HOTKEYS,
});

eventManager.on('PlayingGame', function bindHotkeys() {
  const hotkey = new Hotkey('End turn', (e) => {
    if (fullDisable.value()) return;
    const disabled = e instanceof KeyboardEvent ? spaceDisable.value() : mouseDisable.value();
    if (disabled) return;
    if (!$(e.target).is('#endTurnBtn') && global('userTurn') === global('userId')) global('endTurn')();
  }, {
    keys: ' ',
    clicks: MOUSE_BUTTON.Middle,
  });
  hotkeys.push(hotkey);

  if (!fullDisable.value() && !spaceDisable.value() && !mouseDisable.value()) {
    infoToast({
      // TODO: translation?
      text: 'You can skip turns with <code>space</code> and <code>middle mouse button</code>. (These can be disabled in settings)',
      className: 'dismissable',
      buttons: {
        text: Translation.General('settings'),
        className: 'dismiss',
        css,
        onclick: (_) => {
          settings.open('Game');
        },
      },
    }, 'underscript.notice.endTurn.hotkeys', '1');
  }
});
