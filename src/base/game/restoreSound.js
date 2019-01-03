// Restore sound on refresh
eventManager.on('getReconnection', () => {
  if (settings.value('gameMusicDisabled')) return;
  let playing = false;
  music.addEventListener('play', () => playing = true);
  function restoreSound() {
    if (playing) return;
    music.play();
  }
  document.addEventListener('click', restoreSound, { once: true, passive: true });
});
