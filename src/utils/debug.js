import { toast } from './2.toasts.js';
import merge from './merge.js';

export function debug(message, permission = 'debugging', ...extras) {
  if (!value(permission) && !value('debugging.*')) return;
  // message.stack = new Error().stack.split('\n').slice(2);
  console.log(`[${permission}]`, message, ...extras);
}

export function debugToast(arg, permission = 'debugging') {
  if (!value(permission) && !value('debugging.*')) return false;
  if (typeof arg === 'string') {
    arg = {
      text: arg,
    };
  }
  const defaults = {
    background: '#c8354e',
    textShadow: '#e74c3c 1px 2px 1px',
    css: { 'font-family': 'inherit' },
    button: {
      // Don't use buttons, mouseOver sucks
      background: '#e25353',
      textShadow: '#46231f 0px 0px 3px',
    },
  };
  return toast(merge(defaults, arg));
}

function value(key) {
  const val = localStorage.getItem(key);
  return val === '1' || val === 'true';
}
