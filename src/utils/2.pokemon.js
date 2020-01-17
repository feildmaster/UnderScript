function wrap(callback, prefix = '') { // eslint-disable-line no-unused-vars, consistent-return
  try {
    return callback();
  } catch (e) {
    console.error(`${prefix ? `[${prefix}] ` : callback && callback.name || ''}Error occured`, e); // eslint-disable-line no-mixed-operators, no-console
  }
}
