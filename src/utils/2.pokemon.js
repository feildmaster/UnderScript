import { captureError } from './sentry.js';

export default function wrap(callback, prefix = '', logger = console) {
  try {
    return callback();
  } catch (e) {
    const name = prefix || callback && callback.name || 'Undefined';
    captureError(e, {
      name,
      function: 'wrap',
    });
    logger.error(`[${name}] Error occured`, e); // eslint-disable-line no-mixed-operators
  }
  return undefined;
}
