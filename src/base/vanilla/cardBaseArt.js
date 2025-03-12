import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { globalSet } from '../../utils/global.js';

const setting = settings.register({
  name: 'Force Basic Card Skins',
  key: 'underscript.hide.card-skins',
  page: 'Library',
  category: 'Card Skins',
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
