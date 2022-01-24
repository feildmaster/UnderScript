fn.getPageName = () => {
  const length = location.pathname.length;
  let temp;
  // eslint-disable-next-line no-cond-assign
  if ((temp = location.pathname.indexOf('.')) === -1 && (temp = location.pathname.lastIndexOf('/')) <= 0) {
    temp = null;
  }
  return location.pathname.substring(1, temp || length);
};

function onPage(name, fn) {
  const r = fn.getPageName() === name;
  if (typeof fn === 'function' && r) {
    fn();
  }
  return r;
}

api.register('onPage', onPage);
