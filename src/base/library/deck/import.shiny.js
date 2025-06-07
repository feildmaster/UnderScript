import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { globalSet } from 'src/utils/global.js';
import Translation from 'src/structures/constants/translation';

const setting = settings.register({
  name: Translation.Setting('import.shiny'),
  key: 'underscript.import.shiny',
  default: true,
  page: 'Library',
  category: Translation.CATEGORY_CHAT_IMPORT,
});

function override(idCard, list = []) {
  if (setting.value()) {
    list.sort((a, b) => b.shiny - a.shiny);
  }
  return this.super(idCard, list);
}

eventManager.on(':preload:Decks', () => {
  globalSet('getCardInList', override);
});
