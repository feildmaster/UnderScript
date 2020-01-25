if (!location.host.includes('undercards.net')) {
  function setup() { // eslint-disable-line no-inner-declarations
    if (typeof setVersion === 'function') setVersion(GM_info.script.version, GM_info.scriptHandler);
  }
  if (document.readyState === 'complete') {
    setup();
  } else {
    window.addEventListener('load', setup);
  }
  return; // eslint-disable-line no-useless-return
}
