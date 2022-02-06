import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { globalSet } from '../../utils/global';

const setting = settings.register({
  name: 'Prefer Shiny',
  key: 'underscript.import.shiny',
  default: true,
  page: 'Library',
  category: 'Import',
});

function override(idCard, list = []) {
  if (setting.value()) {
    list.sort((a, b) => b.shiny - a.shiny);
  }
  return this.super(idCard, list);
}

eventManager.on(':loaded:Decks', () => {
  globalSet('getCardInList', override);
});
