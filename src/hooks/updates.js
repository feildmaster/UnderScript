// Detect pending updates, display message, open window... allow updating.
import luxon from 'luxon';
import eventManager from 'src/utils/eventManager';
import { toast as Toast } from 'src/utils/2.toasts';
import * as menu from 'src/utils/menu';
import * as settings from 'src/utils/settings';
import each from 'src/utils/each';
import wrap from 'src/utils/2.pokemon';
import Translation from 'src/structures/constants/translation';
import { buttonCSS, DAY, HOUR, scriptVersion, UNDERSCRIPT } from 'src/utils/1.variables';
import sleep from 'src/utils/sleep';
import createParser from 'src/utils/parser';
import DialogHelper from 'src/utils/DialogHelper';
import compound from 'src/utils/compoundEvent';
import { getTranslationArray } from 'src/base/underscript/translation';

const CHECKING = 'underscript.update.checking'; // TODO: change to setting?
const LAST = 'underscript.update.last'; // TODO: change to setting?
const PREFIX = 'underscript.pending.';

let autoTimeout;
let toast;

export const disabled = settings.register({
  name: Translation.Setting('update'),
  key: 'underscript.disable.updates',
  category: Translation.CATEGORY_UPDATES,
});

export const silent = settings.register({
  name: Translation.Setting('update.silent'),
  key: 'underscript.updates.silent',
  category: Translation.CATEGORY_UPDATES,
});

const keys = {
  frequency: Translation.Setting('update.frequency.option').key,
  toast: Translation.Toast('updater'),
  button: Translation.General('updater.open'),
  checking: Translation.Toast('update.checking'),
  updateNote: Translation.Menu('update.note', 1),
  available: Translation.Toast('update.available', 1),
  title: Translation.General('updates'),
  updateCurrent: Translation.General('update.current', 1),
  updateNew: Translation.General('update.new', 1),
};

const frequency = settings.register({
  name: Translation.Setting('update.frequency'),
  key: 'underscript.updates.frequency',
  data: () => {
    const tls = getTranslationArray(keys.frequency);
    return [0, HOUR, DAY].map((val, i) => (tls ? [
      tls[i],
      val,
    ] : val));
  },
  default: HOUR,
  type: 'select',
  category: Translation.CATEGORY_UPDATES,
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
        newVersion,
        version,
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
    const version = key === UNDERSCRIPT ? scriptVersion : plugin.version;
    const isValid = existing.version === undefined || existing.version === version;
    const isNotUpdated = existing.newVersion !== version;
    if (isNotUpdated && isValid) {
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
      title: keys.toast.translate(),
      text,
      className: 'dismissable',
      buttons: addButton ? {
        text: keys.button.translate(),
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
    notify(keys.available.translate(updateFound), true);
  } else if (!auto && !pendingUpdates.size) {
    notify(keys.available.translate(0));
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
    notify(keys.available.translate(updateFound), true);
  }
}

function open() {
  dialog.open({
    title: keys.title,
    message: build,
  });
}

menu.addButton({
  text: Translation.Menu('update'),
  action() {
    check(false);
  },
  note() {
    const last = Number(localStorage.getItem(LAST));
    const when = last ? luxon.DateTime.fromMillis(last).toLocaleString(luxon.DateTime.DATETIME_FULL) : 'never';
    return keys.updateNote.translate(when);
  },
});

menu.addButton({
  text: Translation.Menu('update.pending'),
  action: open,
  // note() {},
  hidden() {
    return !pendingUpdates.size;
  },
});

eventManager.on(':update', (auto) => {
  toast?.close();
  if (auto && silent.value()) return;
  notify(keys.checking.translate());
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
      label: Translation.General('refresh').translate(),
      cssClass: 'btn-success',
      action() {
        location.reload();
      },
    });
    addedRefresh = true;
  }
  function add({
    name,
    newVersion,
    url,
    version,
  }) {
    const button = $(`<a>`)
      .text(keys.updateNew.translate(newVersion))
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
      $('<div>').text(keys.updateCurrent.translate(version || Translation.UNKNOWN)),
      button,
    ));
  }
  const underscript = pendingUpdates.get(UNDERSCRIPT);
  if (underscript) {
    add({
      ...underscript,
      name: UNDERSCRIPT,
    });
  }
  [...pendingUpdates.entries()].forEach(
    ([name, data]) => {
      if (name === UNDERSCRIPT) return;
      add({
        ...data,
        name,
      });
    },
  );
  return container.children();
}
