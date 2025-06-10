import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { globalSet } from 'src/utils/global.js';
import onPage from 'src/utils/onPage.js';

// TODO: translation
const setting = settings.register({
  name: 'Disable Scrolling Collection Pages Hotkey (mousewheel)',
  key: 'underscript.disable.scrolling',
  refresh: onPage('Decks') || onPage('Crafting'),
  page: 'Library',
});

eventManager.on(':preload:Decks :preload:Crafting', function scrollwheelLoaded() {
  globalSet('onload', function onload() {
    this.super?.();
    if (setting.value()) $('#collection').off('mousewheel DOMMouseScroll');
  });
});
