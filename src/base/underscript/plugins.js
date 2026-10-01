import Translation from 'src/structures/constants/translation.ts';
import compound from 'src/utils/compoundEvent.js';
import DialogHelper from 'src/utils/DialogHelper.js';
import eventManager from 'src/utils/eventManager.js';
import * as menu from 'src/utils/menu.js';
import * as registry from 'src/utils/pluginRegistry.js';
import style from 'src/utils/style.js';
import css from './plugins.css';

const keys = {
  button: Translation.Menu('plugins'),
  note: Translation.Menu('plugins.note'),
  title: Translation.General('plugins'),
  author: Translation.General('plugins.author'),
  available: Translation.General('plugins.available'),
  empty: Translation.General('plugins.empty'),
  failed: Translation.General('plugins.failed'),
  install: Translation.General('plugins.install'),
  installed: Translation.General('plugins.installed'),
  latest: Translation.General('plugins.latest'),
  loading: Translation.General('loading'),
  name: Translation.General('plugins.name'),
  noMatch: Translation.General('plugins.noMatch'),
  refresh: Translation.General('refresh'),
  reinstall: Translation.General('plugins.reinstall'),
  search: Translation.General('search.plugins'),
  stale: Translation.General('plugins.stale'),
  unavailable: Translation.General('plugins.unavailable'),
};

const EMPTY = '-';

style.add(css);

const STATUSES = [
  { id: 'installed', label: keys.installed },
  { id: 'stale', label: keys.stale },
  { id: 'available', label: keys.available },
];

const dialog = new DialogHelper();
let container;
let tableHolder;
let refreshed;
let complete;
let query = '';
const hidden = new Set();

dialog.onClose(() => {
  container = null;
  tableHolder = null;
  refreshed = false;
  complete = false;
  query = '';
  hidden.clear();
});

function addRefresh() {
  if (refreshed) return;
  refreshed = true;
  dialog.prependButton({
    label: `${keys.refresh}`,
    cssClass: 'btn-success',
    action() {
      location.reload();
    },
  });
}

function open() {
  dialog.open({
    title: `${keys.title}`,
    cssClass: 'underscript-dialog plugin-registry',
    message: build,
  });
  registry.refresh().then(update);
}

function update() {
  if (complete) return;
  render();
}

function build() {
  tableHolder = $('<div>');
  container = $('<div>').append(toolbar(), tableHolder);
  render();
  return container;
}

function toolbar() {
  const search = $('<input type="search" class="form-control plugin-search">')
    .attr('placeholder', `${keys.search}`)
    .val(query)
    .on('input', () => {
      query = search.val().trim().toLowerCase();
      render();
    });
  const filters = $('<div class="plugin-filters">').append(
    STATUSES.map(({ id, label }) => {
      const button = $('<button type="button" class="btn btn-sm">')
        .text(`${label}`)
        .on('click', () => {
          if (!hidden.delete(id)) hidden.add(id);
          button.toggleClass('btn-primary', !hidden.has(id)).toggleClass('btn-stale', hidden.has(id));
          render();
        });
      return button.toggleClass('btn-primary', !hidden.has(id)).toggleClass('btn-stale', hidden.has(id));
    }),
  );
  return $('<div class="plugin-toolbar">').append(search, filters);
}

function statusOf(name) {
  if (registry.isRunning(name)) return 'installed';
  return registry.wasSeen(name) ? 'stale' : 'available';
}

function matches({ name, author }) {
  if (hidden.has(statusOf(name))) return false;
  if (!query) return true;
  return `${name} ${author || ''}`.toLowerCase().includes(query);
}

function render() {
  if (!tableHolder) return;
  const plugins = registry.plugins();
  const visible = plugins.filter(matches);
  const body = $('<tbody>');
  if (!visible.length) {
    body.append($('<tr>').append(
      $('<td class="empty" colspan="5">').text(`${plugins.length ? keys.noMatch : emptyText()}`),
    ));
  } else {
    visible.sort(
      ({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB),
    ).forEach((entry) => body.append(row(entry)));
  }
  complete = plugins.length > 0 && plugins.every(({ name }) => registry.info(name));
  tableHolder.empty().append($('<table class="table">').append(header(), body));
}

function header() {
  return $('<thead>').append($('<tr>').append(
    $('<th>').text(`${keys.name}`),
    $('<th>').text(`${keys.author}`),
    $('<th class="version">').text(`${keys.installed}`),
    $('<th class="version">').text(`${keys.latest}`),
    $('<th class="action">'),
  ));
}

function emptyText() {
  switch (registry.status()) {
    case 'error': return keys.unavailable;
    case 'ready': return keys.empty;
    default: return keys.loading;
  }
}

function row({ name, author }) {
  const { version } = registry.info(name) || {};
  const running = registry.isRunning(name);
  const stale = !running && registry.wasSeen(name);
  return $('<tr>')
    .toggleClass('stale', stale)
    .append(
      $('<td>').text(name),
      $('<td>').text(author || EMPTY),
      $('<td class="version">').text(installed({ name, running, stale })),
      latest({ name, running, version }),
      $('<td class="action">').append(action({ name, running, stale })),
    );
}

function installed({ name, running, stale }) {
  if (running) return registry.runningVersion(name) || `${Translation.UNKNOWN}`;
  if (stale) return `${keys.stale}`;
  return EMPTY;
}

function latest({ name, running, version }) {
  const cell = $('<td class="version">');
  if (!version) return cell.text(EMPTY);
  const current = running && registry.runningVersion(name);
  if (current && current !== version) {
    return cell.addClass('outdated').append(
      $('<span class="glyphicon glyphicon-arrow-up">'),
      ' ',
      $('<span>').text(version),
    );
  }
  return cell.text(version);
}

function action({ name, running, stale }) {
  if (running) {
    return $('<button disabled>')
      .addClass('btn btn-sm btn-primary')
      .text(`${keys.installed}`);
  }
  const meta = registry.info(name);
  if (!meta?.url) {
    return $('<button disabled>')
      .addClass('btn btn-sm btn-stale')
      .text(`${meta ? keys.failed : keys.loading}`);
  }
  const button = $('<a>')
    .text(stale ? `${keys.reinstall}` : `${keys.install}`)
    .attr({
      href: meta.url,
      rel: 'noreferrer',
      target: 'updateUserScript',
    })
    .addClass('btn btn-sm')
    .toggleClass('btn-stale', stale)
    .toggleClass('btn-success', !stale)
    .on('click auxclick', () => {
      addRefresh();
      button.removeClass().addClass('btn btn-sm btn-primary');
    });
  return button;
}

menu.addButton({
  text: keys.button,
  action: open,
  enabled() {
    return typeof BootstrapDialog !== 'undefined';
  },
  note() {
    if (!this.enabled()) return keys.note;
    return undefined;
  },
});

compound('underscript:ready', ':load', () => {
  registry.load().then(registry.markSeen);
  registry.refresh().then(update);
});

eventManager.on(':update', () => {
  registry.refresh({ force: true }).then(update);
});
