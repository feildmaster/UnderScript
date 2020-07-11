function wrap(callback, prefix = '') {
  try {
    return callback();
  } catch (e) {
    console.error(`${prefix ? `[${prefix}] ` : callback && callback.name || ''}Error occured`, e); // eslint-disable-line no-mixed-operators
  }
  return undefined;
}
