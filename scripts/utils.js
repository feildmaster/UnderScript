import fs from 'node:fs/promises';

export function assign(obj = {}, lang = '', key = '', value = '') {
  // Only add key if value exists
  if (!value || value.startsWith('//')) return;
  obj[lang] ??= {}; // Does lang exist?
  obj[lang][key] = value;
}

export async function readJSON(file) {
  const content = await fs.readFile(file);
  return JSON.parse(content);
}

export function writeFile(path, data) {
  return fs.writeFile(path, data);
}

export function sortKeys(obj = {}) {
  const keys = Object.keys(obj);
  if (!keys.length) return undefined;
  const sorted = {};
  keys.sort().forEach(
    (key) => {
      const value = obj[key];
      sorted[key] = typeof value === 'object' ? sortKeys(value) : value;
    },
  );
  return sorted;
}
