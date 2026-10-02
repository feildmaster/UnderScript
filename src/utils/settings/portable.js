const ALWAYS_PREFIXES = ['underscript.notice.', 'underscript.plugin.'];

export function createFilter(settings) {
  const keys = new Set();
  const excluded = new Set();
  const prefixes = [...ALWAYS_PREFIXES];
  settings.forEach(({ key, extraPrefix, exportable }) => {
    if (!exportable) {
      excluded.add(key);
      return;
    }
    keys.add(key);
    if (extraPrefix) prefixes.push(extraPrefix);
  });
  return (key) => !excluded.has(key) && (keys.has(key) || prefixes.some((prefix) => key.startsWith(prefix)));
}

export function serialize(storage, accepts) {
  const data = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (accepts(key)) data[key] = storage.getItem(key);
  }
  return Object.keys(data).length ? JSON.stringify(data, null, 2) : '';
}

export function parse(string, accepts) {
  const data = JSON.parse(string);
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid settings data');
  const accepted = {};
  const skipped = [];
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string' && accepts(key)) {
      accepted[key] = value;
    } else {
      skipped.push(key);
    }
  });
  return { accepted, skipped };
}
