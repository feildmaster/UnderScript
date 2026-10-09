import fs from 'node:fs/promises';
import glob from 'fast-glob';
import {
  fileExists, isMain, readJSON, writeFile,
} from './utils.js';

const STALE_MARK = '!';
const LANG_CODE = /^[a-z]{2,3}(?:-[A-Za-z0-9]+)?$/;

const isObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);
const isComment = (key) => key.startsWith('//');
const join = (prefix, key) => (key === '~' ? prefix : [prefix, key].filter((_) => _).join('.'));
const blank = (value) => (Array.isArray(value) ? value.map(() => '') : '');
const fit = (current, value) => (Array.isArray(value) && Array.isArray(current) ?
  value.map((_, index) => current[index] || '').concat(current.slice(value.length)) :
  current);

/**
 * Collect translated values and the English text they were written against
 * @returns {{ values: Map<string, unknown>, sources: Map<string, unknown> }}
 */
export function collect(obj = {}, prefix = '', result = { values: new Map(), sources: new Map(), flagged: new Set() }) {
  Object.entries(obj).forEach(([key, value]) => {
    if (isComment(key)) {
      if (isObject(value)) return;
      const flag = key.endsWith(STALE_MARK);
      const full = join(prefix, key.substring(2, flag ? key.length - 1 : key.length));
      result.sources.set(full, value);
      if (flag) result.flagged.add(full);
      return;
    }
    const full = join(prefix, key);
    if (isObject(value)) {
      collect(value, full, result);
      return;
    }
    result.values.set(full, value);
  });
  return result;
}

/**
 * Build a translation template from the english file contents
 * @returns {{ template: object, missing: string[], stale: string[], unknown: string[] }}
 */
export function createTemplate(english = {}, existing = {}) {
  const { values, sources, flagged } = collect(existing);
  const known = new Set();
  const missing = [];
  const stale = [];

  const build = (obj, prefix) => {
    const out = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (isComment(key)) return;
      const full = join(prefix, key);
      if (isObject(value)) {
        out[key] = build(value, full);
        return;
      }
      known.add(full);
      const current = values.get(full);
      const translated = Array.isArray(current) ? current.some((_) => _) : !!current;
      if (!translated) missing.push(full);
      const changed = sources.has(full) && JSON.stringify(sources.get(full)) !== JSON.stringify(value);
      const isStale = translated && (changed || flagged.has(full));
      if (isStale) stale.push(full);
      out[`//${key}${isStale ? STALE_MARK : ''}`] = value;
      out[key] = translated ? fit(current, value) : blank(value);
    });
    return out;
  };

  const template = build(english, '');
  const unknown = [...values.keys()].filter((key) => !known.has(key));
  unknown.forEach((key) => {
    template[key] = values.get(key);
  });
  return { template, missing, stale, unknown };
}

export async function generate(lang) {
  if (!LANG_CODE.test(lang) || lang === 'en') {
    throw new Error(`Invalid language code "${lang}"`);
  }
  const files = await glob('lang/en/*.json');
  const results = await Promise.all(files.sort().map(async (file) => {
    const name = file.split('/').pop();
    const target = `lang/${lang}/${name}`;
    const existing = await fileExists(target) ? await readJSON(target) : {};
    const result = createTemplate(await readJSON(file), existing);
    await writeFile(target, `${JSON.stringify(result.template, null, 2)}\n`);
    return { name, ...result };
  }));

  results.forEach(({
    name, missing, stale, unknown,
  }) => {
    console.log(`${lang}/${name}: ${missing.length} untranslated`);
    stale.forEach((key) => console.warn(`  English changed for "${key}"`));
    unknown.forEach((key) => console.warn(`  Unknown key "${key}"`));
  });
}

export default async function main(...langs) {
  const targets = langs.length ? langs : (await fs.readdir('lang', { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name !== 'en')
    .map((entry) => entry.name);
  if (!targets.length) {
    console.log('Usage: npm run lang -- <language code>');
    return;
  }
  await Promise.all(targets.map(generate));
}

if (isMain(import.meta)) {
  main(...process.argv.slice(2));
}
