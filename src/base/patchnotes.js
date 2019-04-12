wrap(function patchNotes() {
  const setting = settings.register({
    name: 'Disable Patch Notes',
    key: 'underscript.disable.patches',
  });

  if (setting.value() || !scriptVersion.includes('.')) return;
  style.add(
    '#AlertToast div.uschangelog span:nth-of-type(2) { max-height: 300px; overflow-y: auto; display: block; }'
  );
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