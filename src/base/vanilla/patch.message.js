settings.register({
  name: 'Disable version toast',
  key: 'underscript.season.disable',
  refresh: () => onPage(''),
  category: 'Home',
});

onPage('', function patches() {
  if (settings.value('underscript.season.disable')) return;
  eventManager.on(':loaded', () => {
    document.querySelectorAll('.infoIndex').forEach((el) => {
      const patch = el.querySelector('[data-i18n-custom="home-patch-message"]');
      if (!patch) return;
      const text = $el.html.get(el);
      const version = patch.dataset.i18nArgs;
      el.remove();
      const key = `underscript.season.dismissed.${version}`;
      const message = $.i18n('home-patch-message', version);
      fn.cleanData('underscript.season.dismissed.', key);
      if (settings.value(key) === message) return;
      fn.dismissable({
        key,
        text,
        title: `Undercards Update`,
        value: message,
      });
    });
  });
});
