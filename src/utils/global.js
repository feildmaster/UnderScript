function global(...key) {
  const {
    throws = true,
  } = typeof key[key.length - 1] === 'object' ? key.pop() : {};
  const found = key.find(e => window.hasOwnProperty(e));
  if (found === undefined) {
    const msg = `[${key.join(',')}] does not exist`;
    if (throws) throw new Error(msg);
    return debug(msg);
  }
  return window[found];
}

function globalSet(key, value, {
  throws=true,
} = {}) {
  if (!window.hasOwnProperty(key)) {
    const msg = `[${key}] does not exist`;
    if (throws) throw new Error(msg);
    return debug(msg);
  }
  const original = window[key];
  if (typeof value === 'function') {
    const wrapper = {
      super: original,
    };
    window[key] = value.bind(wrapper);
  } else {
    window[key] = value;
  }
  return original;
}
