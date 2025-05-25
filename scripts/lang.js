import fs from 'node:fs/promises';
import glob from 'fast-glob';

async function main() {
  // Load base "en" first
  const data = await bundle(
    await glob('lang/en/*.json'),
  );

  // Now load other languages (if any)
  Object.entries(await bundle(
    await glob([
      'lang/*/*.json',
      '!lang/en',
    ]),
  )).forEach(
    ([lang, obj]) => Object.entries(obj).forEach(
      ([key, value]) => {
        // Check if key exists in "en"
        if (!Object.hasOwn(data.en, key)) {
          console.warn(`${lang} has extra key "${key}"`);
          // assign(data, lang, `???${key}`, value);
          // return;
        }
        assign(data, lang, key, value);
      },
    ),
  );

  const file = JSON.stringify(sort(data), null, 2);
  if (!file) return;
  await fs.writeFile('lang/underscript.json', file);
}

function assign(obj = {}, lang = '', key = '', value = '') {
  // Only add key if value exists
  if (!value) return;
  obj[lang] ??= {}; // Does lang exist?
  obj[lang][key] = value;
}

/**
 * Bundle all files into a single object
 * @returns {Promise<Record<string, Record<string, string>>>}
 */
async function bundle(files = []) {
  const ret = {};
  await Promise.all(files.map(async (file) => {
    const [lang, name] = getFileParts(file);

    Object.entries(await parse(file)).forEach(
      ([key, value]) => {
        assign(ret, lang, `underscript.${name}.${key}`, value);
      },
    );
  }));
  return ret;
}

// Split file path into [lang, name]
function getFileParts(file = '') {
  const [/* dir */, lang, name] = file.split('/');
  return [lang, name.substring(0, name.lastIndexOf('.'))];
}

async function parse(file) {
  const content = await fs.readFile(file);
  return JSON.parse(content);
}

function sort(obj = {}) {
  const keys = Object.keys(obj);
  if (!keys.length) return undefined;
  const sorted = {};
  keys.sort().forEach(
    (key) => {
      const value = obj[key];
      sorted[key] = typeof value === 'object' ? sort(value) : value;
    },
  );
  return sorted;
}

main();
