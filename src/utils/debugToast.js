import { toast } from './2.toasts.js';
import addToastClass from './toastClass.js';
import { enabled } from './debug.js';
import { general } from './debugFlags.js';

/**
 * @param {string | object} arg
 * @param {import('./debugFlags.js').DebugFlag} [flag]
 */
export default function debugToast(arg, flag = general) {
  if (!enabled(flag)) return false;
  if (typeof arg === 'string') {
    arg = {
      text: arg,
    };
  }
  return toast({ ...arg, className: addToastClass(arg.className, 'underscript-toast-inherit') });
}
