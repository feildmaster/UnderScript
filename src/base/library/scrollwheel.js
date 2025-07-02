import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { globalSet } from 'src/utils/global.js';
import onPage from 'src/utils/onPage.js';
import Translation from 'src/structures/constants/translation.ts';

const setting = settings.register({
  name: Translation.Setting('library.scrollwheel'),
  key: 'underscript.disable.scrolling',
  refresh: onPage('Decks') || onPage('Crafting'),
  page: 'Library',
  category: Translation.CATEGORY_HOTKEYS,
});

eventManager.on(':preload:Decks :preload:Crafting', function scrollwheelLoaded() {
  globalSet('onload', function onload() {
    this.super?.();
    if (setting.value()) $('#collection').off('mousewheel DOMMouseScroll');
  });
});
