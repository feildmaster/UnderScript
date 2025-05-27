import eventManager from 'src/utils/eventManager';

// TODO: include base underscript.json in script so we always have something to show?
const translations = (async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/UCProjects/UnderScript/refs/heads/master/lang/underscript.json',
    {
      cache: 'default',
    },
  );
  return response.json();
})();

eventManager.on('translation:loaded', async () => {
  await $.i18n().load(await translations);
  eventManager.singleton.emit('translation:underscript');
});
