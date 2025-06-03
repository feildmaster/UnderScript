import eventManager from 'src/utils/eventManager.js';
import { scriptVersion, window } from 'src/utils/1.variables.js';
import { getPageName } from 'src/utils/onPage.js';
import sleep from 'src/utils/sleep.js';

const page = getPageName();

function loaded() {
  if (eventManager.singleton.emit(':loaded').ran) {
    console.warn('`:loaded` event is depricated, please migrate to `:preload`.');
  }
  eventManager.singleton.emit(':preload');
  if (eventManager.singleton.emit(`:loaded:${page}`).ran) {
    console.warn(`\`:loaded:${page}\` event is depricated, please migrate to \`:preload:${page}\``);
  }
  eventManager.singleton.emit(`:preload:${page}`);
}
function done() {
  eventManager.singleton.emit(':load');
  eventManager.singleton.emit(`:load:${page}`);
}

if (location.host.includes('undercards.net')) {
  console.log(`UnderScript(v${scriptVersion}): Loaded`); // eslint-disable-line no-console
  if (!location.pathname.includes('/', 1)) {
    register();
  }
}
function register() {
  document.addEventListener('DOMContentLoaded', loaded);
  window.addEventListener('load', () => sleep().then(done));
  const COMPLETE = document.readyState === 'complete';
  if (document.readyState === 'interactive' || COMPLETE) {
    loaded();
  }
  if (COMPLETE) {
    done();
  }
}
