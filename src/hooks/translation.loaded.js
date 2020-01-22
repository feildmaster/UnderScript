eventManager.on(':loaded', () => {
  let called;
  globalSet('translateElement', function translateElement(...args) {
    if (!called) {
      eventManager.emit('translation:loaded');
      called = true;
    }
    return this.super(...args);
  });
});
