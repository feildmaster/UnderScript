import fs from 'node:fs/promises';
import nodePath from 'node:path';

export function assign(obj = {}, lang = '', key = '', value = '') {
  // Only add key if value exists
  if (!value) return;
  obj[lang] ??= {}; // Does lang exist?
  obj[lang][key] = value;
}

export async function readJSON(file) {
  const content = await fs.readFile(file);
  return JSON.parse(content);
}

export async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export function writeFile(path, data) {
  return fs.writeFile(path, data);
}

export function sortKeys(obj = {}) {
  const keys = Object.keys(obj);
  if (!keys.length) return undefined;
  const sorted = {};
  keys.sort(
    (a, b) => uncomment(a).localeCompare(uncomment(b)),
  ).forEach(
    (key) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        sorted[key] = value;
        // value.forEach((val, index) => {
        //   sorted[`${key}.${index + 1}`] = val;
        // });
        return;
      }
      sorted[key] = typeof value === 'object' ? sortKeys(value) : value;
    },
  );
  return sorted;
}

/**
 * Checks if module is the main module
 * @param {ImportMeta} meta
 */
export function isMain({ url }) {
  return nodePath.normalize(url).endsWith(process.argv[1]);
}

function uncomment(string = '') {
  if (string.startsWith('//')) {
    return string.substring(2);
  }
  return string;
}
