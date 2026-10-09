/*
 * SimpleToast - A small library for toasts
 */
((root, factory) => {
  // Do we care about frames? Until I get some tests in... no
  if (window !== window.top) return;
  const boundToast = window.SimpleToast;
  const localToast = factory();
  root.SimpleToast = localToast;
  console.log(`SimpleToast(v${localToast.versionString}): Loaded`);
  // Apply to window if SimpleToast doesn't currently exist
  if (root !== window && !(boundToast instanceof localToast)) {
    window.SimpleToast = localToast;
    console.log(`SimpleToast(v${localToast.versionString}): Publicized`);
  }
})(this, () => {
  const version = buildVersion(1, 11, 0);
  const style = {
    root: {
      display: 'flex',
      'flex-direction': 'column-reverse',
      'align-items': 'flex-end',
      position: 'fixed',
      'white-space': 'pre-wrap',
      bottom: 0,
      right: 0,
      zIndex: 1000,
    },
    title: {
      display: 'block',
      fontSize: '15px',
      'font-style': 'italic',
    },
    toast: {
      maxWidth: '320px',
      padding: '5px 8px',
      borderRadius: '3px',
      fontFamily: 'cursive, sans-serif',
      fontSize: '13px',
      cursor: 'pointer',
      color: '#fafeff',
      margin: '4px',
      textShadow: '#3498db 1px 2px 1px',
      background: '#2980b9',
    },
    footer: {
      display: 'block',
      fontSize: '10px',
    },
    button: {
      height: '20px',
      margin: '-3px 0 0 3px',
      padding: '0 5px',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
      border: '1px solid rgba(27,31,35,0.2)',
      borderRadius: '10px',
      fontSize: '11px',
      textShadow: '#173646 0px 0px 3px',
      background: '#2c9fea',
      mouseOver: {
        'border-color': 'rgba(27,31,35,0.35)',
        background: '#149FFF',
      },
    },
  };

  function applyCSS(element, css = {}) {
    const old = {};
    Object.keys(css).forEach((key) => {
      const val = css[key];
      if (typeof val === 'object') return;
      old[key] = element.style[key];
      element.style[key] = css[key];
    });
    return old;
  }

  const toasts = new Map();
  let root = (() => {
    function create() {
      const el = document.createElement('div');
      el.setAttribute('id', 'AlertToast');
      applyCSS(el, style.root);

      const body = document.getElementsByTagName('body')[0];
      if (body) { // Depending on when the script is loaded... this might be null
        body.appendChild(el);
      } else {
        window.addEventListener('load', () => {
          const exists = document.getElementById(el.id);
          if (exists) { // Another script may have created it already
            if (el.hasChildNodes()) { // Transfer existing nodes to new root
              const nodes = el.childNodes;
              for (let i = 0, l = nodes.length; i < l; i++) {
                exists.appendChild(nodes[i]);
              }
            }
            root = exists; // Set this incase anyone still has a reference to this toast
            return;
          }
          document.getElementsByTagName('body')[0].appendChild(el);
        });
      }
      return el;
    }
    return document.getElementById('AlertToast') || create();
  })();
  let count = 0;

  let timeout = null;
  function startTimeout() {
    if (timeout) return;
    timeout = setTimeout(() => {
      timeout = null;
      const now = Date.now();
      let pending = 0;
      toasts.forEach((toast) => {
        if (!toast.timeout) return;
        if (now < toast.timeout) {
          pending += 1;
          return;
        }
        toast.timedout();
      });
      if (pending) {
        startTimeout();
      }
    }, 1000);
  }

  function noop() {}
  const blankToast = Object.freeze({
    setText: noop,
    exists: () => false,
    close: noop,
  });
  function Toast({title, text, footer, className, css = {}, buttons, timeout, onClose} = {}) {
    if (typeof arguments[0] === 'string') {
      text = arguments[0];
    }
    if (!text) return blankToast;
    const id = count++;
    const el = document.createElement('div');
    const tel = el.appendChild(document.createElement('span'));
    const body = el.appendChild(document.createElement('span'));
    const fel = el.appendChild(document.createElement('span'));
    if (className) {
      const clazz = className.toast || className;
      el.className = Array.isArray(clazz) ? clazz.join(' ') : (typeof clazz === 'string' ? clazz : undefined);
    }
    applyCSS(el, style.toast);
    applyCSS(el, css.toast || css);

    // Add title, body
    if (title) {
      applyCSS(tel, style.title);
      applyCSS(tel, css.title);
      tel.textContent = title;
    }
    body.textContent = text;
    if (footer) {
      applyCSS(fel, style.footer);
      applyCSS(fel, css.footer);
      fel.textContent = footer;
    }
    
    let closeType = 'unknown';
    const toast = {
      setText: (newText) => {
        if (!newText || !toast.exists()) return;
        body.textContent = newText;
      },
      exists: () => toasts.has(id),
      close: () => {
        if (!toast.exists()) return;
        root.removeChild(el);
        toasts.delete(id);
        if (typeof onClose === 'function') {
          onClose(toast, closeType);
        }
      },
      timedout: () => {
        closeType = 'timeout';
        toast.close();
      },
      closed: () => {
        closeType = 'dismissed';
        toast.close();
      },
    };
    if (timeout) {
      toast.timeout = Date.now() + timeout;
    }

    if (typeof buttons === 'object') {
      if (!Array.isArray(buttons)) {
        buttons = [buttons];
      }
      buttons.forEach((button) => {
        if (!button.text) return;
        const elb = document.createElement('button');
        if (button.className || className && className.button) {
          const clazz = button.className || className.button;
          elb.className = Array.isArray(clazz) ? clazz.join(' ') : clazz;
        }
        elb.innerHTML = button.text;
        applyCSS(elb, style.button);
        applyCSS(elb, css.button);
        applyCSS(elb, button.css);
        if (typeof button.onclick === 'function') {
          elb.onclick = button.onclick;
        }
        let prev = {};
        elb.onmouseover = () => {
          const hoverStyle = Object.assign(
            {},
            style.button.mouseOver,
            css.button && css.button.mouseOver,
            button.css && button.css.mouseOver
          );
          prev = applyCSS(hoverStyle);
        };
        elb.onmouseout = () => {
          applyCSS(elb, prev);
          prev = {};
        };
        el.insertBefore(elb, fel);
      });
    }
    el.addEventListener('click', toast.closed);

    root.appendChild(el);
    toasts.set(id, toast);
    if (timeout) {
      startTimeout();
    }
    const safeToast = {};
    Object.keys(blankToast).forEach((key) => safeToast[key] = toast[key]);
    return safeToast;
  }

  Toast.version = version.number;
  Toast.versionString = version.string;
  Toast.count = () => toasts.size;
  function buildVersion(major, minor = 0, patch = 0) {
    return {
      string: `${major}.${minor}${patch ? `.${patch}` : ''}`,
      number: major * 1000000000 + minor * 1000 + patch,
    };
  }
  return Object.freeze(Toast);
});
