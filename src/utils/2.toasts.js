import Translation from 'src/structures/constants/translation.js';
import { buttonCSS } from './1.variables.js';
import merge from './merge.js';
import eventManager from './eventManager.js';
import toArray from './toArray.js';

let ready = false;

eventManager.on('underscript:ready', () => ready = true);

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
  const isTranslation = [
    arg.text,
    arg.title,
    ...toArray(arg.buttons).map(({ text }) => text),
  ].some((obj) => obj instanceof Translation);
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
  if (ready && isTranslation) preprocess(arg);
  const slice = new SimpleToast(merge(defaults, arg));
  if (!ready && isTranslation && slice.exists()) {
    const el = $('#AlertToast > div:last');
    eventManager.on('underscript:ready', () => {
      process(slice, el, arg);
    });
  }
  return slice;
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
    title: error.name || error.title || Translation.ERROR,
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
    title: Translation.INFO,
    css: {
      'font-family': 'inherit',
    },
  };
  return toast(merge(defaults, arg, override));
}

export function dismissable({ title, text, key, value = 'true', css = {} }) {
  if (localStorage.getItem(key) === value) return undefined;
  const buttons = {
    text: Translation.DISMISS,
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

function preprocess(arg) {
  ['text', 'title'].forEach((prop) => {
    if (arg[prop] instanceof Translation) arg[prop] = `${arg[prop]}`;
  });
  toArray(arg.buttons).forEach((button) => {
    if (button.text instanceof Translation) button.text = `${button.text}`;
  });
}

function process(instance, el, { text, title, buttons }) {
  if (text instanceof Translation) instance.setText(`${text}`);
  if (title instanceof Translation) el.find('> span:first').text(title);
  const $buttons = el.find('> button');
  toArray(buttons).forEach((button, i) => {
    if (button.text instanceof Translation) $buttons[i].textContent = button.text;
  });
}
