wrap(function patchNotes() {
  const setting = settings.register({
    name: 'Disable Patch Notes',
    key: 'underscript.disable.patches',
  });

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
    });
  }
});