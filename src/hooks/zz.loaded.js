console.log(`UnderScript(v${scriptVersion}): Loaded`); // eslint-disable-line no-console
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

if (eventManager.emit(':ready').ran) {
  api.register('ready', true);
}
