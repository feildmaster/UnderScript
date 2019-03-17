function wrap(callback, prefix = '') {
  try {
    callback();
  } catch (e) {
    console.error(`${prefix?`[${prefix}] `:''}Error occured`, e);
  }
}
