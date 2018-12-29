function debug(message, permission = 'debugging') {
  if (localStorage.getItem(permission) !== "true") return;
  console.log(message);
}

fn.debug = (arg, permission = 'debugging') => {
  if (localStorage.getItem(permission) !== 'true') return;
  if (typeof arg === 'string') {
    arg = {
      text: arg,
    };
  }
  const defaults = {
    background: '#c8354e',
    textShadow: '#e74c3c 1px 2px 1px',
    css: {'font-family': 'inherit'},
    button: {
      // Don't use buttons, mouseOver sucks
      background: '#e25353',
      textShadow: '#46231f 0px 0px 3px',
    },
  };
  return fn.toast(fn.merge(defaults, arg));
};
