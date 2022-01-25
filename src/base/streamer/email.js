eventManager.on(':loaded:Settings', () => {
  if (!settings.value('underscript.streaming')) return;
  $el.text.contains(document.querySelectorAll('p'), 'Mail :').forEach((e) => {
    e.innerText = 'Mail : <hidden>';
  });
});
