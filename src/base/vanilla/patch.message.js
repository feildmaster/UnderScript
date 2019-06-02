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
      const text = $el.html.get(el);
      const index = text.indexOf(' - ');
      const version = text.substring(0, index);
      if (!version) return;
      el.remove();
      const key = `underscript.season.dismissed.${version}`;
      fn.cleanData('underscript.season.', key);
      if (settings.value(key)) return;
      fn.dismissable({
        key,
        title: version,
        text: text.substring(index + 3),
      });
    });
  });
});
