import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { globalSet } from '../../utils/global';
import toLocale from '../../utils/toLocale';

const setting = settings.register({
  name: 'Force English for card names',
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

function toEnglish(id, ...data) {
  return toLocale({ id, data });
}

eventManager.on(':loaded', () => {
  if (!window.createCard || !$.i18n) return;
  globalSet('createCard', createCard);
});
