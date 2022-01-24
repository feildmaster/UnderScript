function getPageName() {
  const { pathname } = location;
  const length = pathname.length;
  let temp = pathname.indexOf('.');
  // eslint-disable-next-line no-cond-assign
  if (temp === -1 && (temp = pathname.lastIndexOf('/')) <= 0) {
    temp = null;
  }
  return pathname.substring(1, temp || length);
}

function onPage(name, callback) {
  const r = getPageName() === name;
  if (typeof callback === 'function' && r) {
    callback();
  }
  return r;
}

api.register('onPage', onPage);
fn.getPageName = getPageName;
