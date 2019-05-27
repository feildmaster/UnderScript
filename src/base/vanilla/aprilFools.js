wrap(function noFoolsHere() {
  const setting = settings.register({
    name: 'Disable April Fools Jokes',
    key: 'underscript.disable.fishday',
    note: 'Disables *almost* everything.<br>Will require you to refresh the page.',
  });
  if (setting.value()) {
    eventManager.on(':loaded', () => globalSet('fish', false, { throws: false }));
  }
});
