import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { globalSet } from 'src/utils/global.js';
import { toEnglish } from 'src/utils/toLocale.js';
import { window } from 'src/utils/1.variables.js';
import Translation from 'src/structures/constants/translation';

const setting = settings.register({
  name: Translation.Setting('card.name.english'),
  key: 'underscript.standardized.cardname',
});

function createCard(card, ...rest) {
  if (!setting.value() || $.i18n().locale === 'en') {
    return this.super(card, ...rest);
  }

  const c = $(this.super(card, ...rest));
  c.find('.cardName').text(toEnglish(`card-name-${card.fixedId}`, 1));
  return c[0].outerHTML;
}

eventManager.on(':preload', () => {
  if (!window.createCard || !$.i18n) return;
  globalSet('createCard', createCard);
});
