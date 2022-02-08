import eventManager from '../utils/eventManager';
import { scriptVersion } from '../utils/1.variables';
import { getPageName } from '../utils/onPage';

function loaded() {
  // TODO: needs to do this faster, due to new script builder, impossible to make this go last (without a bunch of work)
  eventManager.singleton.emit(':ready');
  eventManager.singleton.emit(':loaded');
  eventManager.singleton.emit(`:loaded:${getPageName()}`);
}
function done() {
  eventManager.singleton.emit(':load');
  eventManager.singleton.emit(`:load:${getPageName()}`);
}

if (location.host.includes('undercards.net')) {
  console.log(`UnderScript(v${scriptVersion}): Loaded`); // eslint-disable-line no-console
  document.addEventListener('DOMContentLoaded', loaded);
  window.addEventListener('load', done);
  const COMPLETE = document.readyState === 'complete';
  if (document.readyState === 'interactive' || COMPLETE) {
    loaded();
  }
  if (COMPLETE) {
    done();
  }
}
