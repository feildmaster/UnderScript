import eventManager from '../utils/eventManager.js';
import { scriptVersion } from '../utils/1.variables.js';
import { getPageName } from '../utils/onPage.js';
import sleep from '../utils/sleep.js';

function loaded() {
  eventManager.singleton.emit(':loaded');
  eventManager.singleton.emit(`:loaded:${getPageName()}`);
}
function done() {
  eventManager.singleton.emit(':load');
  eventManager.singleton.emit(`:load:${getPageName()}`);
}

if (location.host.includes('undercards.net')) {
  console.log(`UnderScript(v${scriptVersion}): Loaded`); // eslint-disable-line no-console
  if (document.title.includes('Undercards')) {
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
