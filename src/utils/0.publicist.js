import { window } from './1.variables.js';

function setup() {
  // eslint-disable-next-line no-undef
  if (typeof setVersion === 'function') setVersion(GM_info.script.version, GM_info.scriptHandler);
}

if (!location.host.includes('undercards.net')) {
  if (document.readyState === 'complete') {
    setup();
  } else {
    window.addEventListener('load', setup);
  }
}
