console.log(`UnderScript(v${scriptVersion}): Loaded`); // eslint-disable-line no-console
eventManager.on(':ready', () => {
  function loaded() {
    eventManager.singleton.emit(':loaded');
  }
  function done() {
    eventManager.singleton.emit(':load');
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

if (eventManager.singleton.emit(':ready').ran) {
  api.finalize();
}
