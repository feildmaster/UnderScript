wrap(function standardizedNaming() {
  const setting = settings.register({
    name: 'Force English for card names',
    key: 'underscript.standardized.cardname',
  });

  function createCard(card, ...rest) {
    if (!setting.value() || $.i18n().locale === 'EN') {
      return this.super(card, ...rest);
    }

    const c = $(this.super(card, ...rest));
    c.find('.cardName').text(toEnglish(`card-name-${card.fixedId}`, 1));
    return c[0].outerHTML;
  }

  function toEnglish(id, ...data) { // TODO: make this a utility
    const l = $.i18n().locale;
    $.i18n().locale = 'EN';
    const text = $.i18n(id, ...data)
    $.i18n().locale = l;
    return text;
  }

  eventManager.on(':loaded', () => {
    if (!window.createCard || !$.i18n) return;
    globalSet('createCard', createCard);
  });
});
