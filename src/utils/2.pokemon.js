export default function wrap(callback, prefix = '') {
  try {
    return callback();
  } catch (e) {
    console.error(`[${prefix || callback && callback.name || 'Undefined'}] Error occured`, e); // eslint-disable-line no-mixed-operators
  }
  return undefined;
}
