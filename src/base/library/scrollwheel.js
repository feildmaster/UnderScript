import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { globalSet } from '../../utils/global';
import onPage from '../../utils/onPage';

const setting = settings.register({
  name: 'Disable Scrolling Collection Pages Hotkey (mousewheel)',
  key: 'underscript.disable.scrolling',
  refresh: onPage('Decks') || onPage('Crafting'),
  page: 'Library',
});

eventManager.on(':loaded:Decks :loaded:Crafting', function scrollwheelLoaded() {
  globalSet('onload', function onload() {
    this.super && this.super();
    if (setting.value()) $('#collection').off('mousewheel DOMMouseScroll');
  });
});
