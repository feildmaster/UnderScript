import Translation from 'src/structures/constants/translation.js';
import { buttonCSS } from './1.variables.js';
import merge from './merge.js';

export function blankToast() {
  return new SimpleToast();
}

export function toast(arg) {
  if (!arg) return false;
  if (typeof arg === 'string') {
    arg = {
      text: arg,
    };
  }
  const defaults = {
    footer: 'via UnderScript',
    css: {
      'background-color': 'rgba(0,5,20,0.6)',
      'text-shadow': '',
      'font-family': 'monospace',
      footer: {
        'text-align': 'end',
      },
    },
  };
  return new SimpleToast(merge(defaults, arg));
}

export function errorToast(error) {
  function getStack(err = {}) {
    const stack = err.stack;
    if (stack) {
      return stack.replace('<', '&lt;');
    }
    return null;
  }

  const lToast = {
    title: error.name || error.title || Translation.ERROR.translate(),
    text: error.message || error.text || getStack(error.error || error) || error,
    css: {
      'background-color': 'rgba(200,0,0,0.6)',
    },
    className: error.className,
    onClose: error.onClose,
    footer: error.footer,
    buttons: error.buttons,
  };
  return toast(lToast);
}

export function infoToast(arg, key, val = '1') {
  if (localStorage.getItem(key) === val) return null;
  if (typeof arg === 'string') {
    arg = {
      text: arg,
    };
  } else if (typeof arg !== 'object') return null;
  const override = {
    onClose: (...args) => {
      if (typeof arg.onClose === 'function') {
        if (arg.onClose(...args)) {
          return;
        }
      }
      localStorage.setItem(key, val);
    },
  };
  const defaults = {
    title: Translation.INFO.translate(),
    css: {
      'font-family': 'inherit',
    },
  };
  return toast(merge(defaults, arg, override));
}

export function dismissable({ title, text, key, value = 'true', css = {} }) {
  if (localStorage.getItem(key) === value) return undefined;
  const buttons = {
    text: Translation.DISMISS.translate(),
    className: 'dismiss',
    css: buttonCSS,
    onclick: (e) => {
      localStorage.setItem(key, value);
    },
  };
  return toast({
    title,
    text,
    buttons,
    className: 'dismissable',
    css,
  });
}
