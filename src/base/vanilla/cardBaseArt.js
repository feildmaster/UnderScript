import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { globalSet } from 'src/utils/global.js';
import { window } from 'src/utils/1.variables.js';
import Translation from 'src/structures/constants/translation';

const setting = settings.register({
  name: Translation.Setting('skins.basic'),
  key: 'underscript.hide.card-skins',
  page: 'Library',
  category: Translation.CATEGORY_CARD_SKINS,
});

function createCard(card) {
  const image = card.baseImage;
  if (setting.value() && image && image !== card.image) {
    card.typeSkin = 0;
    card.originalImage = card.image;
    card.image = image;
  }
  return this.super(card);
}

eventManager.on(':preload', () => {
  if (!window.createCard) return;
  globalSet('createCard', createCard);
});
