fn.toast = (arg) => {
  // Why do I even check for SimpleToast? It *has* to be loaded at this point...
  if (!window.SimpleToast || !arg) return false;
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
  return new SimpleToast(fn.merge(defaults, arg));
};

fn.errorToast = (error) => {
  function getStack(err = {}) {
    const stack = err.stack;
    if (stack) {
      return stack.replace('<', '&lt;');
    }
    return null;
  }

  const toast = {
    title: error.name || error.title || 'Error',
    text: error.message || error.text || getStack(error.error || error) || error,
    css: {
      'background-color': 'rgba(200,0,0,0.6)',
    },
  };
  if (error.footer) {
    toast.footer = error.footer;
  }
  return fn.toast(toast);
};

fn.infoToast = (arg, key, val) => {
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
    title: 'Did you know?',
    css: {
      'font-family': 'inherit',
    },
  };
  return fn.toast(fn.merge(defaults, arg, override));
};

fn.dismissable = ({ title, text, key, value = true }) => {
  const buttons = {
    text: 'Dismiss',
    className: 'dismiss',
    css: {
      border: '',
      height: '',
      background: '',
      'font-size': '',
      margin: '',
      'border-radius': '',
    },
    onclick: (e) => {
      localStorage.setItem(key, value);
    },
  };
  return fn.toast({
    title,
    text,
    buttons,
    className: 'dismissable',
  });
};
