import fs from 'node:fs/promises';
import axios from 'axios';
import createParser from '../src/utils/parser/index.js';
import { isMain } from './utils.js';

export const REGISTRY = 'plugins.json';
export const FIELDS = ['name', 'author', 'updateURL', 'downloadURL'];

const NAME_RULE = /^[a-z0-9 ]+$/i;
const NAME_LENGTH = 20;
const SHORTHAND = /^[\w.-]+\/[\w.-]+$/;
const TIMEOUT = 15000;

/**
 * @typedef {{ index?: number, name?: string, message: string }} Problem
 */

function isText(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function isHttps(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Checks the shape of every entry without touching the network.
 * @param {unknown} data
 * @returns {Problem[]}
 */
export function validate(data) {
  if (!Array.isArray(data)) {
    return [{ message: `${REGISTRY} must contain a list of plugins` }];
  }
  /** @type {Problem[]} */
  const problems = [];
  const seen = new Map();

  data.forEach((entry, index) => {
    const report = (message) => problems.push({ index, name: entry?.name, message });
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      report('Each plugin must be an object with a name, author and updateURL');
      return;
    }

    Object.keys(entry)
      .filter((key) => !FIELDS.includes(key))
      .forEach((key) => report(`Unknown field "${key}", the fields are ${FIELDS.join(', ')}`));

    const { name, author, updateURL, downloadURL } = entry;
    if (!isText(name)) {
      report('name is required');
    } else {
      if (name !== name.trim()) report('name must not start or end with a space');
      if (name.length > NAME_LENGTH) report(`name is too long (${name.length}/${NAME_LENGTH})`);
      if (!NAME_RULE.test(name)) report('name can only contain letters, numbers and spaces');
      const key = name.trim().toLowerCase();
      if (seen.has(key)) {
        report(`name is already used by entry ${seen.get(key) + 1}`);
      } else {
        seen.set(key, index);
      }
    }

    if (!isText(author)) report('author is required');

    if (!isText(updateURL) && !isText(downloadURL)) {
      report('updateURL or downloadURL is required');
    } else if (updateURL !== undefined && !isHttps(updateURL) && !SHORTHAND.test(updateURL)) {
      report('updateURL must be an https link');
    }

    if (downloadURL !== undefined && !isHttps(downloadURL)) {
      report('downloadURL must be an https link');
    }
  });

  return problems;
}

/**
 * Resolves an entry the way UnderScript does when it lists plugins.
 * @param {{ updateURL?: string, downloadURL?: string }} entry
 * @returns {Promise<{ version: string, url: string }>}
 */
export async function resolve(entry) {
  const parser = createParser(entry);
  const data = await parser.getUpdateData();
  const version = await parser.getVersion(data);
  const url = await parser.getDownload(data);
  if (!isHttps(url)) throw new Error(`The install link is not an https link (${url})`);
  return { version, url };
}

const HEAD_UNSUPPORTED = [403, 405];
const PROBE = { maxRedirects: 5, validateStatus: () => true };

async function reach(url) {
  const response = await axios.head(url, PROBE);
  if (!HEAD_UNSUPPORTED.includes(response.status)) return response;
  const ranged = await axios.get(url, { ...PROBE, headers: { Range: 'bytes=0-0' }, responseType: 'stream' });
  ranged.data?.destroy?.();
  return ranged;
}

/**
 * Makes sure an install link answers, and is not a web page.
 * @param {string} url
 * @returns {Promise<void>}
 */
export async function verify(url) {
  const { status, headers } = await reach(url);
  if (status >= 400) throw new Error(`${url} answered ${status}`);
  if (/text\/html/i.test(headers?.['content-type'] ?? '')) {
    throw new Error(`${url} is a web page, not a script`);
  }
}

const HINTS = {
  'Version not found': 'the file has no // @version line',
  'URL not found': 'the file has no // @downloadURL line, and the entry has no downloadURL',
  'File not found': 'there is no file at the updateURL',
};

function describe(error) {
  const status = error.response?.status;
  if (status) return `${error.config?.url ?? 'The request'} answered ${status}`;
  return HINTS[error.message] ?? error.message;
}

/**
 * @param {string} text contents of plugins.json
 * @param {{ network?: boolean }} [options]
 * @returns {Promise<Problem[]>}
 */
export async function check(text, { network = true } = {}) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return [{ message: `${REGISTRY} is not valid JSON: ${e.message}` }];
  }

  const problems = validate(data);
  if (!network || !Array.isArray(data)) return problems;

  const invalid = new Set(problems.map(({ index }) => index));
  const failures = await Promise.all(data.map(async (entry, index) => {
    if (invalid.has(index)) return undefined;
    const fail = (message) => ({ index, name: entry.name, message });
    let link;
    try {
      link = await resolve(entry);
    } catch (e) {
      return fail(`Could not resolve an install link: ${describe(e)}`);
    }
    try {
      await verify(link.url);
    } catch (e) {
      return fail(`The install link does not work: ${describe(e)}`);
    }
    return undefined;
  }));
  return [...problems, ...failures.filter(Boolean)];
}

function authenticate(token) {
  axios.interceptors.request.use((config) => {
    if (config.url?.startsWith('https://api.github.com/') && !config.url.startsWith('https://api.github.com/gists/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

function label({ index, name }) {
  if (name) return `"${name}"`;
  return index === undefined ? '' : `entry ${index + 1}`;
}

export default async function main(args = process.argv.slice(2)) {
  const network = !args.includes('--offline');
  const file = args.find((arg) => !arg.startsWith('-')) ?? REGISTRY;
  if (process.env.GITHUB_TOKEN) authenticate(process.env.GITHUB_TOKEN);
  axios.defaults.timeout = TIMEOUT;

  const problems = await check(await fs.readFile(file, 'utf8'), { network });
  if (!problems.length) {
    console.log(`${file} is valid${network ? ', and every plugin resolves an install link' : ''}`);
    return;
  }
  problems.forEach((problem) => {
    const title = label(problem);
    if (process.env.GITHUB_ACTIONS) {
      console.error(`::error file=${file}${title ? `,title=${title}` : ''}::${problem.message}`);
    } else {
      console.error(title ? `${title}: ${problem.message}` : problem.message);
    }
  });
  process.exitCode = 1;
}

if (isMain(import.meta)) {
  main();
}
