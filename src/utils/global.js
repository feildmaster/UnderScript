function global(...key) {
  const found = key.find(e => window.hasOwnProperty(e));
  if (found === undefined) throw new Error(`[${key.join(',')}] does not exist`);
  return window[found];
}
