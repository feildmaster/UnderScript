import Translation from 'src/structures/constants/translation.js';
import merge from './merge.js';
import eventManager from './eventManager.js';
import toArray from './toArray.js';
import addToastClass from './toastClass.js';
import applyToastCss from './toastCss.js';

let ready = false;

eventManager.on('underscript:ready', () => ready = true);

function dismissing(button) {
  if (!button) return button;
  return {
    ...button,
    onclick(event, instance) {
      try {
        if (typeof button.onclick === 'function') button.onclick.call(this, event, instance);
      } finally {
        if (!event.cancelBubble) instance.close('dismissed');
      }
    },
  };
}

export function blankToast() {
  return new SimpleToast();
}

export function toast(arg) {
  if (!arg) return false;
  if (typeof arg === 'string' || arg instanceof Translation) {
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
  };
  if (ready && isTranslation) preprocess(arg);
  const { css, ...options } = merge(defaults, arg);
  options.className = addToastClass(options.className, 'underscript-toast');
  if (options.buttons) options.buttons = toArray(options.buttons).map(dismissing);
  const slice = new SimpleToast(options);
  if (slice.exists()) applyToastCss(slice, css, options.buttons);
  if (!ready && isTranslation && slice.exists()) {
    eventManager.on('underscript:ready', () => {
      process(slice, arg);
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
    className: addToastClass(error.className, 'underscript-toast-error'),
    onClose: error.onClose,
    footer: error.footer,
    buttons: error.buttons,
    timeout: error.timeout,
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
    className: addToastClass(arg.className, 'underscript-toast-info'),
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
  };
  return toast(merge(defaults, arg, override));
}

export function dismissable({ title, text, key, value = 'true' }) {
  if (localStorage.getItem(key) === value) return undefined;
  const buttons = {
    text: Translation.DISMISS,
    onclick: (e) => {
      localStorage.setItem(key, value);
    },
  };
  return toast({
    title,
    text,
    buttons,
    className: 'dismissable',
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

function process(instance, { text, title, buttons }) {
  const el = instance.element;
  if (text instanceof Translation) instance.setText(`${text}`);
  if (title instanceof Translation) el.querySelector('.simpletoast-title').textContent = `${title}`;
  const rendered = el.querySelectorAll('.simpletoast-button');
  toArray(buttons).filter((button) => button?.text).forEach((button, i) => {
    if (button.text instanceof Translation) rendered[i].textContent = `${button.text}`;
  });
}
