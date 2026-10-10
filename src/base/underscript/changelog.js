import luxon from 'luxon';
import showdown from 'showdown';
import axios from 'axios';
import { scriptVersion } from 'src/utils/1.variables.js';
import style from 'src/utils/style.js';
import * as menu from 'src/utils/menu.js';
import Translation from 'src/structures/constants/translation.ts';
import styles from './changelog.css';

const changelog = {};

const keys = {
  title: Translation.General('changelog'),
  text: Translation.Menu('changelog'),
  note: Translation.Menu('changelog.note'),
  loading: Translation.General('changelog.loading'),
  unavailable: Translation.General('changelog.unavailable'),
};

// Change log :O
style.add(styles);
function getMarkdown() {
  if (!changelog.markdown) {
    changelog.markdown = new showdown.Converter({
      noHeaderId: true,
      strikethrough: true,
      disableForced4SpacesIndentedSublists: true,
    });
  }
  return changelog.markdown;
}

function open(message) {
  BootstrapDialog.show({
    message,
    title: `${keys.title}`,
    cssClass: 'mono us-changelog',
    buttons: [{
      label: `${Translation.CLOSE}`,
      action(self) {
        self.close();
      },
    }],
  });
}

async function getText() {
  if (typeof GM_getResourceText === 'function') {
    const text = GM_getResourceText('changelog.md');
    if (text) return text;
  }
  const { data } = await axios.get('https://raw.githubusercontent.com/UCProjects/UnderScript/refs/heads/master/changelog.md');
  return data;
}

export async function get(version = 'latest', short = false) {
  const cache = version.includes('.');
  const key = `${version}${short ? '_short' : ''}`;
  if (changelog[key]) return changelog[key];

  function getHtml(text) {
    const parsedHTML = getMarkdown().makeHtml(text).replace(/\r?\n/g, '');
    // Cache results
    if (cache) changelog[key] = parsedHTML;
    return parsedHTML;
  }

  if (short) {
    const { data: { body: text, name, published_at: published } } = await axios.get(`https://api.github.com/repos/UCProjects/UnderScript/releases/tags/${version}`);
    const date = luxon.DateTime.fromISO(published).toLocaleString(luxon.DateTime.DATE_MED);
    return getHtml(`## ${name} (${date})\n${text}`);
  }

  const data = await getText();
  const start = data.indexOf(`\n## ${cache ? `Version ${version}` : ''}`);
  if (!~start) throw new Error('Invalid Changelog');
  return getHtml(data.substring(start));
}

export function load(version = 'latest', short = false) {
  const container = $('<div>').text(keys.loading);
  open(container);
  get(version, short).catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    return `${keys.unavailable}`;
  }).then((m) => container.html(m));
}

// Add menu button
menu.addButton({
  text: keys.text,
  action() {
    load(scriptVersion === 'L' ? 'latest' : scriptVersion);
  },
  enabled() {
    return typeof BootstrapDialog !== 'undefined';
  },
  note() {
    if (!this.enabled()) {
      return keys.note;
    }
    return undefined;
  },
});
