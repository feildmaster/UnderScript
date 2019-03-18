wrap(function patchNotes() {
  if (!scriptVersion.includes('.')) return;
  const versionKey = `underscript.update.${scriptVersion}`;
  if (localStorage.getItem(versionKey)) return;
  
  changelog.get(scriptVersion, true)
    .then(notify)
    .catch(); // Don't try again
  
  function notify(text) {
    localStorage.setItem(versionKey, true);
    fn.toast({
      text,
      title: '[UnderScript] Patch Notes',
      footer: `v${scriptVersion}`,
    });
  }
});