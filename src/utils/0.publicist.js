if (!location.host.includes('undercards.net')) {
  if (typeof setVersion === 'function') setVersion(GM_info.script.version, GM_info.scriptHandler);
  return; // eslint-disable-line no-useless-return
}
