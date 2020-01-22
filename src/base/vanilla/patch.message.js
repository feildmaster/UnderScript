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
      const prefix = 'underscript.season.dismissed.';
      const key = `${prefix}${version}`;
      fn.cleanData(prefix, key);
      if (settings.value(key)) return;
      fn.dismissable({
        key,
        text, // This only works because it gets translated by the loader
        title: `Undercards Update`,
      });
    });
  });
});
