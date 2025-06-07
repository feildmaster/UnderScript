import eventManager from 'src/utils/eventManager';

// TODO: include base underscript.json in script so we always have something to show?
const translations = (async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/UCProjects/UnderScript/refs/heads/master/lang/underscript.json',
    {
      cache: 'default',
    },
  );
  const text = await response.text();
  return JSON.parse(text, function reviver(key, value) {
    if (Array.isArray(value)) {
      value.forEach((val, i) => {
        this[`${key}.${i + 1}`] = val;
      });
      return undefined;
    }
    return value;
  });
})();

eventManager.on('translation:loaded', async () => {
  await $.i18n().load(await translations);
  eventManager.singleton.emit('translation:underscript');
});
