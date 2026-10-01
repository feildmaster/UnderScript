import axios from 'axios';
import { HOUR } from './1.variables.js';
import { debug } from './debug.js';
import createParser from './parser/index.js';
import { getPluginNames, getVersion } from './plugin.js';

const URL = 'https://raw.githubusercontent.com/UCProjects/UnderScript/refs/heads/master/plugins.json';
const LIST = 'underscript.registry.list';
const VERSIONS = 'underscript.registry.versions';
const SEEN = 'underscript.registry.seen';

/** @type {{ name: string, author: string, updateURL: string, downloadURL?: string }[]} */
let list = [];
/** @type {'loading'|'ready'|'error'} */
let state = 'loading';
let loading;
let refreshing;

const versions = read(VERSIONS);
const seen = read(SEEN);

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch (e) {
    debug(e, 'debugging.registry');
    return {};
  }
}

function write(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    debug(e, 'debugging.registry');
  }
}

function clean(data) {
  if (!Array.isArray(data)) throw new Error('Invalid registry');
  return data.filter(
    (entry) => {
      const { name, updateURL, downloadURL } = entry ?? {};
      return typeof name === 'string' && name &&
        (typeof updateURL === 'string' || typeof downloadURL === 'string');
    },
  ).map(({ name, author, updateURL, downloadURL }) => ({
    name,
    author,
    updateURL,
    downloadURL,
  }));
}

function localList() {
  if (typeof GM_getResourceText !== 'function') return undefined;
  const text = GM_getResourceText('plugins.json');
  if (!text) return undefined;
  try {
    return clean(JSON.parse(text));
  } catch (e) {
    debug(e, 'debugging.registry');
    return undefined;
  }
}

async function fetchList() {
  const { data } = await axios.get(URL);
  const entries = clean(data);
  write(LIST, { time: Date.now(), plugins: entries });
  return entries;
}

export function load(force = false) {
  if (loading && !force) return loading;
  const local = localList();
  if (local) {
    list = local;
    state = 'ready';
    loading = Promise.resolve(list);
    return loading;
  }
  const cache = read(LIST);
  if (!force && Array.isArray(cache.plugins) && Date.now() - cache.time < HOUR) {
    list = cache.plugins;
    state = 'ready';
    loading = Promise.resolve(list);
    return loading;
  }
  loading = fetchList().then((entries) => {
    list = entries;
    state = 'ready';
    return list;
  }).catch((e) => {
    debug(e, 'debugging.registry');
    list = Array.isArray(cache.plugins) ? cache.plugins : [];
    state = list.length ? 'ready' : 'error';
    return list;
  });
  return loading;
}

export function plugins() {
  return list;
}

export function status() {
  return state;
}

/** @returns {{ version: string, url: string, time: number } | undefined} */
export function info(name) {
  return versions[name];
}

export function isRunning(name) {
  return getPluginNames().includes(name);
}

export function runningVersion(name) {
  return getVersion(name);
}

export function wasSeen(name) {
  return Object.hasOwn(seen, name);
}

export function markSeen() {
  const running = getPluginNames();
  const found = list.filter(({ name }) => running.includes(name));
  if (!found.length) return;
  found.forEach(({ name }) => {
    seen[name] = getVersion(name);
  });
  write(SEEN, seen);
}

async function resolve({ name, updateURL, downloadURL }) {
  const parser = createParser({ downloadURL, updateURL });
  const data = await parser.getUpdateData();
  versions[name] = {
    version: await parser.getVersion(data),
    url: await parser.getDownload(data),
    time: Date.now(),
  };
}

export function refresh({ force = false } = {}) {
  if (refreshing) return refreshing;
  refreshing = load(force).then(async (entries) => {
    const pending = force ? entries : entries.filter(({ name }) => !versions[name]);
    if (!pending.length) return;
    await Promise.all(pending.map((entry) => resolve(entry).catch((e) => {
      debug(e, 'debugging.registry', entry.name);
      versions[entry.name] = { time: Date.now(), error: true };
    })));
    write(VERSIONS, versions);
  }).finally(() => {
    refreshing = undefined;
  });
  return refreshing;
}
