eventManager.on(':loaded', () => {
  globalSet('translateElement', function translateElement(...args) {
    eventManager.singleton.emit('translation:loaded');
    return this.super(...args);
  }, {
    throws: false,
  });
});
