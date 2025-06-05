// Detect pending updates, display message, open window... allow updating.
import luxon from 'luxon';
import eventManager from 'src/utils/eventManager';
import { toast as Toast } from 'src/utils/2.toasts';
import * as menu from 'src/utils/menu';
import * as settings from 'src/utils/settings';
import each from 'src/utils/each';
import wrap from 'src/utils/2.pokemon';
import Translation from 'src/structures/constants/translation';
import { buttonCSS, scriptVersion } from 'src/utils/1.variables';
import sleep from 'src/utils/sleep';
import createParser from 'src/utils/parser';
import DialogHelper from 'src/utils/DialogHelper';
import { getVersion } from 'src/utils/plugin';
import compound from 'src/utils/compoundEvent';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const CHECKING = 'underscript.update.checking'; // TODO: change to setting?
const LAST = 'underscript.update.last'; // TODO: change to setting?
const PREFIX = 'underscript.pending.';

let autoTimeout;
let toast;

export const disabled = settings.register({
  // TODO: translation
  name: 'Disable Auto Updates',
  key: 'underscript.disable.updates',
  // TODO: translation
  category: 'Updates',
});

export const silent = settings.register({
  name: 'Run automatic updates in the background',
  key: 'underscript.updates.silent',
  category: 'Updates',
});

const frequency = settings.register({
  // TODO: translation
  name: 'Update Frequency',
  key: 'underscript.updates.frequency',
  // TODO: translation
  data: [
    ['Page Load', 0],
    ['Hourly', HOUR],
    ['Daily', DAY],
  ],
  default: HOUR,
  type: 'select',
  // TODO: translation
  category: 'Updates',
  transform(value) {
    return Number(value) || 0;
  },
});

const dialog = new DialogHelper();
const pendingUpdates = new Map();

export function register({
  plugin,
  version,
  ...rest
}) {
  const key = plugin.name || plugin;
  const data = { version, ...rest };
  localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(data));
  pendingUpdates.set(key, data);
}

// TODO: keep registry of update URL's being used? only allow one of any url
export function registerPlugin(plugin, data = {}) {
  validate(plugin);
  /** @type {FileParser} */
  const parser = createParser(data);
  const { version } = plugin;
  let finished = false;
  plugin.events.until(':update', async () => {
    if (finished || !plugin.canUpdate) return finished;
    const info = await parser.getUpdateData();
    const newVersion = await parser.getVersion(info);
    if (finished || !plugin.canUpdate) return finished;
    if (newVersion !== version) {
      register({
        plugin,
        version: newVersion,
        url: await parser.getDownload(info),
      });
    } else {
      unregister(plugin);
    }
    return false;
  });
  return () => {
    finished = true;
  };
}

export function validate(plugin) {
  const key = plugin.name || plugin;
  const existing = pendingUpdates.get(key);
  if (existing) {
    if (existing.version !== plugin.version) {
      return existing;
    }
    unregister(plugin);
  }
  return false;
}

export function unregister(plugin) {
  const key = plugin.name || plugin;
  localStorage.removeItem(`${PREFIX}${key}`);
  return pendingUpdates.delete(key);
}

function notify(text, addButton = false) {
  if (toast?.exists()) {
    toast.setText(text);
  } else {
    toast = Toast({
      // TODO: translation
      title: 'UnderScript updater',
      text,
      className: 'dismissable',
      buttons: addButton ? {
        text: 'Show Updates',
        className: 'dismiss',
        css: buttonCSS,
        onclick: open,
      } : undefined,
    });
  }
}

async function check(auto = true) {
  if (sessionStorage.getItem(CHECKING)) return;
  sessionStorage.setItem(CHECKING, true);

  if (autoTimeout) {
    clearTimeout(autoTimeout);
    autoTimeout = 0;
  }

  const previousState = !pendingUpdates.size;

  if (!auto || !disabled.value()) {
    await eventManager.async.emit(':update', auto);
  }

  if (!pendingUpdates.size !== previousState) {
    menu.dirty();
  }

  function finish() {
    toast?.close();
    eventManager.emit(':update:finished', auto);
  }

  const updateFound = [...pendingUpdates.values()].filter(({ announce = true }) => announce).length;
  if (updateFound) {
    finish();
    // TODO: translation
    notify('Updates available.', true);
  } else if (!auto && !pendingUpdates.size) {
    // TODO: translation
    notify('No updates available.');
    sleep(3000).then(finish);
  } else {
    sleep(1000).then(finish);
  }

  // Setup next check, defaulting to an hour if "Page Load" is set
  const timeout = frequency.value() || HOUR;
  autoTimeout = setTimeout(check, timeout);

  localStorage.setItem(LAST, Date.now());
  sessionStorage.removeItem(CHECKING);
}

function setup() {
  const last = Number(localStorage.getItem(LAST));
  const now = Date.now();
  const timeout = last - now + frequency.value();

  if (!last || timeout <= 0) {
    check();
  } else {
    autoTimeout = setTimeout(check, timeout);
  }

  const updateFound = [...pendingUpdates.values()].filter(({ announce = true }) => announce).length;
  if (updateFound) {
    notify('Updates available.', true);
  }
}

function open() {
  dialog.open({
    title: 'Pending Updates', // TODO: translation
    message: build,
  });
}

menu.addButton({
  // TODO: translation
  text: 'Check for updates',
  action() {
    check(false);
  },
  note() {
    const last = Number(localStorage.getItem(LAST));
    // TODO: translation
    return `Last Checked: ${last ? luxon.DateTime.fromMillis(last).toLocaleString(luxon.DateTime.DATETIME_FULL) : 'never'}`;
  },
});

menu.addButton({
  // TODO: translation
  text: 'Show Pending Updates',
  action: open,
  // note() {},
  hidden() {
    return !pendingUpdates.size;
  },
});

eventManager.on(':update', (auto) => {
  toast?.close();
  if (auto && silent.value()) return;
  // TODO: translation
  notify('Checking for updates. Please wait.');
});

// Load pending updates
each(localStorage, (data, key) => wrap(() => {
  if (!key.startsWith(PREFIX)) return;
  if (disabled.value()) {
    localStorage.removeItem(key);
    return;
  }
  const name = key.substring(key.lastIndexOf('.') + 1);
  pendingUpdates.set(name, JSON.parse(data));
}, key));

sessionStorage.removeItem(CHECKING);
compound('underscript:ready', ':load', setup);

function build() {
  let addedRefresh = false;
  const container = $('<div>');
  function refreshButton() {
    if (addedRefresh) return;
    dialog.prependButton({
      label: 'Refresh Page',
      cssClass: 'btn-success',
      action() {
        location.reload();
      },
    });
    addedRefresh = true;
  }
  function add({
    currentVersion,
    name,
    url,
    version,
  }) {
    const button = $(`<a>`)
      .text(`Update to ${version}`) // TODO: translation
      .attr({
        href: url,
        rel: 'noreferrer',
        target: 'updateUserScript',
      })
      .addClass('btn btn-success')
      .on('click auxclick', () => {
        refreshButton();
        button
          .removeClass('btn-success')
          .addClass('btn-primary');
      });
    container.append($('<fieldset>').append(
      $('<legend>').text(name),
      $('<div>').text(`Current: ${currentVersion || 'unknown'}`),
      button,
    ));
  }
  const underscript = pendingUpdates.get('UnderScript');
  if (underscript) {
    add({
      ...underscript,
      name: 'UnderScript',
      currentVersion: scriptVersion,
    });
  }
  [...pendingUpdates.entries()].forEach(
    ([name, data]) => {
      if (name === 'UnderScript') return;
      add({
        ...data,
        name,
        currentVersion: getVersion(name),
      });
    },
  );
  return container.children();
}
