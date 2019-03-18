console.log(`UnderScript(v${scriptVersion}): Loaded`);
eventManager.on(':ready', () => {
  function loaded() {
    eventManager.emit(':loaded');
  }
  function done() {
    eventManager.emit(':load');
  }

  document.addEventListener('DOMContentLoaded', loaded);
  window.addEventListener('load', done);
  const COMPLETE = document.readyState === 'complete';
  if (document.readyState === 'interactive' || COMPLETE) {
    loaded();
  }
  if (COMPLETE) {
    done();
  }
});
eventManager.emit(':ready');
