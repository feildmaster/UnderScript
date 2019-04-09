onPage('Settings', () => {
  if (!settings.value('underscript.streaming')) return;
  eventManager.on(':loaded', () => {
    $el.text.contains(document.querySelectorAll('p'), 'Mail :').forEach((e) => e.innerText = 'Mail : <hidden>');
  });
});
