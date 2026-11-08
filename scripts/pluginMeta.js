import fs from 'node:fs/promises';
import axios from 'axios';
import { authenticate, REGISTRY, resolve } from './plugins.js';
import { fileExists, isMain, readJSON, writeFile } from './utils.js';

export const META = 'plugins.meta.json';

const TIMEOUT = 15000;
const SHORTHAND = /^[\w.-]+\/[\w.-]+$/;
const API = 'https://api.github.com';

async function api(path) {
  const { data } = await axios.get(`${API}/${path}`);
  return data;
}

function contentsOf(uri) {
  const url = new URL(uri.replace('/raw/', '/'));
  const [owner, repo, ...rest] = url.pathname.split('/').filter(Boolean);
  const refParts = rest[0] === 'refs' ? 3 : 1;
  const ref = rest.slice(rest[0] === 'refs' ? 2 : 0, refParts).join('/');
  const path = rest.slice(refParts).join('/');
  if (!owner || !repo || !ref || !path) return undefined;
  return { owner, repo, ref, path };
}

/**
 * @param {{ updateURL?: string, downloadURL?: string }} entry
 * @returns {Promise<string | undefined>} an ISO date
 */
export async function lookupDate({ updateURL, downloadURL }) {
  const uri = updateURL || downloadURL;
  if (SHORTHAND.test(uri)) {
    return (await api(`repos/${uri}/releases/latest`)).published_at;
  }
  const url = new URL(uri);
  if (url.hostname === 'gist.github.com') {
    const gist = await api(`gists/${url.pathname.split('/')[2]}`);
    return gist.history?.[0]?.committed_at ?? gist.updated_at;
  }
  if (url.hostname === 'github.com' && uri.includes('/releases/')) {
    const [, owner, repo] = url.pathname.split('/');
    return (await api(`repos/${owner}/${repo}/releases/latest`)).published_at;
  }
  if (url.hostname === 'github.com' || url.hostname === 'raw.githubusercontent.com') {
    const contents = contentsOf(uri);
    if (!contents) return undefined;
    const { owner, repo, ref, path } = contents;
    const commits = await api(`repos/${owner}/${repo}/commits?path=${encodeURIComponent(path)}&sha=${encodeURIComponent(ref)}&per_page=1`);
    return commits[0]?.commit?.committer?.date;
  }
  return undefined;
}

/**
 * @param {{ name: string, updateURL?: string, downloadURL?: string }[]} entries
 * @param {Record<string, { version: string, date: string }>} previous
 * @param {{ resolve?: typeof resolve, lookupDate?: typeof lookupDate }} [tools]
 */
export async function build(entries, previous = {}, tools = {}) {
  const find = tools.resolve ?? resolve;
  const date = tools.lookupDate ?? lookupDate;
  const results = await Promise.all(entries.map(async (entry) => {
    const kept = previous[entry.name];
    let version;
    try {
      ({ version } = await find(entry));
    } catch (e) {
      console.warn(`${entry.name}: ${e.message}`);
      return [entry.name, kept];
    }
    if (kept?.version === version) return [entry.name, kept];
    try {
      const found = await date(entry);
      return [entry.name, found ? { version, date: found } : undefined];
    } catch (e) {
      console.warn(`${entry.name}: ${e.message}`);
      return [entry.name, undefined];
    }
  }));
  return Object.fromEntries(
    results
      .filter(([, value]) => value)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

export default async function main(args = process.argv.slice(2)) {
  const [registry = REGISTRY, output = META] = args.filter((arg) => !arg.startsWith('-'));
  if (process.env.GITHUB_TOKEN) authenticate(process.env.GITHUB_TOKEN);
  axios.defaults.timeout = TIMEOUT;

  const entries = await readJSON(registry);
  const previous = await fileExists(output) ? await readJSON(output) : {};
  const meta = await build(entries, previous);
  const text = `${JSON.stringify(meta, null, 2)}\n`;
  if (await fileExists(output) && await fs.readFile(output, 'utf8') === text) {
    console.log(`${output} is up to date`);
    return;
  }
  await writeFile(output, text);
  console.log(`Wrote ${Object.keys(meta).length} dates to ${output}`);
}

if (isMain(import.meta)) {
  main();
}
