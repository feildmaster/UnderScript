wrap(() => {
  if (!onPage('Translate')) return;
  eventManager.on(':loaded', () => {
    loadLanguages();

    globalSet('createTranslator', newTranslator);

    globalSet('showPage', newShowPage);
  });

  function newTranslator(translator) {
    let ret = this.super(translator);
    if (!translator.translations.length) {
      ret += `<div id="preview">${getPreview('decks-preview')}: <span></span></div>`;
    }
    return ret;
  }

  function newShowPage (page) {
    this.super(page);

    const textarea = $('#translators textarea');
    const preview = $('#preview span');
    textarea.on('input', () => {
      const text = getPreview(textarea.val());
      preview.html(text);
    });
  }

  function getPreview(id, locale = getLocale()) {
    return fn.toLocale({
      locale, id,
      data: [1],
    });
  }

  function getLocale() {
    return document.querySelector('#selectLanguage').value.toLowerCase();
  }

  function loadLanguages() {
    const languages = {};
    const version = global('translateVersion');
    $('#selectLanguage option').each(function () {
      const lang = this.value.toLowerCase();
      languages[lang] = `/translation/${lang}.json?v=${version}`;
    });
    $.i18n().load(languages);
  }
});
