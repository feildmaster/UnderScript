import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { globalSet } from '../../utils/global.js';
import onPage from '../../utils/onPage.js';

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
