import eventManager from '../../../utils/eventManager';
import * as settings from '../../../utils/settings';
import { global } from '../../../utils/global';
import { infoToast } from '../../../utils/2.toasts';
import Hotkey from '../../../utils/hotkey.class';
import { hotkeys } from '../../../utils/1.variables';

const fullDisable = settings.register({
  name: 'Disable End Turn Hotkey',
  key: 'underscript.disable.endTurn',
  page: 'Game',
  category: 'Hotkeys',
});
const spaceDisable = settings.register({
  name: 'Disable End Turn with Space',
  key: 'underscript.disable.endTurn.space',
  disabled: () => fullDisable.value(),
  refresh: () => typeof gameId !== 'undefined',
  page: 'Game',
  category: 'Hotkeys',
});
const mouseDisable = settings.register({
  name: 'Disable End Turn with Middle Click',
  key: 'underscript.disable.endTurn.middleClick',
  disabled: () => fullDisable.value(),
  refresh: () => typeof gameId !== 'undefined',
  page: 'Game',
  category: 'Hotkeys',
});

eventManager.on('PlayingGame', function bindHotkeys() {
  // Binds to Space, Middle Click
  const hotkey = new Hotkey('End turn').run((e) => {
    if (fullDisable.value()) return;
    if (!$(e.target).is('#endTurnBtn') && global('userTurn') === global('userId')) global('endTurn')();
  });
  if (!spaceDisable.value()) {
    hotkey.bindKey(32);
  }
  if (!mouseDisable.value()) {
    hotkey.bindClick(2);
  }
  hotkeys.push(hotkey);

  if (!fullDisable.value() && !spaceDisable.value() && !mouseDisable.value()) {
    infoToast({
      text: 'You can skip turns with <code>space</code> and <code>middle mouse button</code>. (These can be disabled in settings)',
      className: 'dismissable',
      buttons: {
        text: 'Open Settings',
        className: 'dismiss',
        css: {
          border: '',
          height: '',
          background: '',
          'font-size': '',
          margin: '',
          'border-radius': '',
        },
        onclick: (e) => {
          settings.open('Game');
        },
      },
    }, 'underscript.notice.endTurn.hotkeys', '1');
  }
});
