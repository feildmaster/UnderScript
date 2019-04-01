function global(...key) {
  const found = key.find(e => window.hasOwnProperty(e));
  if (found === undefined) throw new Error(`[${key.join(',')}] does not exist`);
  return window[found];
}

function globalSet(key, value) {
  if (!window.hasOwnProperty(key)) throw new Error(`[${key}] does not exist`);
  const original = window[key];
  window[key] = value;
  return original;
}
