wrap(function patchNotes() {
  const setting = settings.register({
    name: 'Disable Patch Notes',
    key: 'underscript.disable.patches',
  });

  fn.cleanData('underscript.update.', scriptVersion, 'last', 'checking', 'latest');
  style.add(
    '#AlertToast div.uschangelog span:nth-of-type(2) { max-height: 300px; overflow-y: auto; display: block; }',
    '#AlertToast div.uschangelog extended { display: none; }',
  );
  if (setting.value() || !scriptVersion.includes('.')) return;
  const versionKey = `underscript.update.${scriptVersion}`;
  if (localStorage.getItem(versionKey)) return;

  changelog.get(scriptVersion, true)
    .then(notify)
    .catch();

  function notify(text) {
    localStorage.setItem(versionKey, true);
    fn.toast({
      text,
      title: '[UnderScript] Patch Notes',
      footer: `v${scriptVersion}`,
      className: 'uschangelog',
    });
  }
});
