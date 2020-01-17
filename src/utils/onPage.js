function onPage(name, fn) {
  const length = location.pathname.length;
  let temp;
  // eslint-disable-next-line no-cond-assign
  if ((temp = location.pathname.indexOf('.')) === -1 && (temp = location.pathname.indexOf('/')) === -1) {
    temp = null;
  }
  const r = location.pathname.substring(1, temp || length) === name;
  if (typeof fn === 'function' && r) {
    fn();
  }
  return r;
}

api.register('onPage', onPage);
