import Translation from 'src/structures/constants/translation.js';
import eventManager from 'src/utils/eventManager.js';
import eventEmitter from 'src/utils/eventEmitter.js';
import style from 'src/utils/style.js';
import * as menu from 'src/utils/menu.js';
import tabManager from 'src/utils/tabbedView.js';
import * as hover from 'src/utils/hover.js';
import each from 'src/utils/each.js';
import wrap from 'src/utils/2.pokemon.js';
import { translateText } from 'src/utils/translate.js';
import DialogHelper from 'src/utils/DialogHelper.js';
import AdvancedMap from './types/map2.js';
import * as types from './types/index.js';
import RegisteredSetting from './RegisteredSetting.js';
import styles from './settings.css';
import { isSettingType, registry } from './settingRegistry.js';
import createSearch from './search.js';
import { createFilter, parse, serialize } from './portable.js';

const defaultSetting = new RegisteredSetting();

style.add(styles);

/**
 * @type {{[key: string]: RegisteredSetting}}
 */
const settingReg = {
  // key: setting
};
const events = eventEmitter();
const configs = new Map();
const pageTokens = new Map();
const pluginViews = new Map();
const dialog = new DialogHelper();
let updateLock = false;

/**
 * @returns {tabManager}
 */
export function getScreen() {
  if (getScreen.screen) {
    return getScreen.screen;
  }
  const screen = tabManager();
  screen.settings({ left: true });

  screen.plugins = tabManager();
  const tab = screen.addTab('Plugins', screen.plugins, { fold: true });
  tab.setEnd(true); // Plugins go to the bottom of the list
  configs.set('Plugins', {
    name: 'Plugins',
    page: tab,
  });

  getScreen.screen = screen;
  return screen;
}

export function pageToken(page, tab) {
  if (!tab || !page?.name) return page;
  let byTab = pageTokens.get(page);
  if (!byTab) {
    byTab = new Map();
    pageTokens.set(page, byTab);
  }
  if (!byTab.has(tab)) {
    byTab.set(tab, {
      plugin: page,
      tab,
      get name() { return tab; },
      get label() { return `${page.name}: ${tab}`; },
      get logger() { return page.logger; },
    });
  }
  return byTab.get(tab);
}

function pageBuilder(key) {
  return () => {
    if (!configs.has(key)) return '';
    const message = getMessage(key);
    return message.html() ? message[0] : '';
  };
}

function getPluginView(plugin) {
  const existing = pluginViews.get(plugin);
  if (existing) return existing;

  const manager = tabManager();
  manager.settings({
    tooltip: hover,
    labels: {
      previous: (page, total) => Translation.General('tabs.previous').withArgs(`${page}`, `${total}`),
      next: (page, total) => Translation.General('tabs.next').withArgs(`${page}`, `${total}`),
    },
  });
  const config = configs.get(plugin);
  const tab = config?.page ?? getScreen().plugins.addTab(plugin.name, manager);
  tab.setContent(manager);

  const tabName = config?.mainName ?? config?.name ?? plugin.name;
  const main = manager.addTab(translateText(tabName), pageBuilder(plugin));
  if (config) config.page = main;

  const view = { tab, manager, main };
  pluginViews.set(plugin, view);
  getPage('Plugins').refresh();
  return view;
}

function getPage(key) {
  const config = configs.get(key);
  if (config && config.page) {
    return config.page;
  }
  if (key?.plugin) {
    return getPluginView(key.plugin).manager.addTab(key.tab, pageBuilder(key));
  }
  if (pluginViews.has(key)) {
    return pluginViews.get(key).main;
  }
  const screen = key.name ? getScreen().plugins : getScreen();
  return screen.addTab(key.name || key, pageBuilder(key));
}

function init(page) {
  if (!configs.has(page)) {
    const name = page === 'main' ? 'UnderScript' : page.name || page;
    const data = {
      name,
      settings: {},
      page: getPage(page),
    };
    data.page.setName(translateText(name));
    configs.set(page, data);
    if (page.name) {
      getPage('Plugins').refresh();
    }
  }
  return configs.get(page);
}

function createSetting(setting = defaultSetting) {
  // TODO: hidden creates a hidden setting?
  if (setting.hidden) return null;
  const ret = $('<div>').addClass('flex-start');
  const { key, type } = setting;
  events.emit(`create:${key}`);
  ret.addClass(getCSSName(type.name));
  events.on(`scroll:${key}`, () => {
    $('.target-setting').removeClass('target-setting');
    ret.addClass('target-setting')
      .get(0).scrollIntoView();
    ret.delay(2000).queue((next) => {
      ret.removeClass('target-setting');
      next();
    });
  });
  const container = $(`<div>`).addClass('flex-stretch');
  const el = $(type.element(setting.value, (...args) => {
    if (!updateLock) updateLock = setting;
    setting.update(...args);
  }, {
    get data() { return setting.data; },
    get disabled() { return setting.disabled; },
    get remove() { return setting.remove; },
    container,
    get name() { return setting.name; },
    key,
    removeSetting() {
      removeSetting(setting, el);
    },
    untilClose,
  }));
  if (!el.find(`#${key.replaceAll('.', '\\.')}`).length) {
    el.attr({
      id: key,
    });
  }

  const label = $(`<label for="${key}">`).html(setting.name);
  const labelPlacement = type.labelFirst();
  if (labelPlacement) {
    ret.append(label, ' ', el);
  } else if (labelPlacement !== null) {
    ret.append(el, ' ', label);
  } else {
    ret.append(el);
  }

  ret.hover((e) => {
    const { note } = setting;
    if (!note) return undefined;
    return hover.show(note)(e);
  }, hover.hide);

  if (setting.reset) {
    const reset = $('<span>')
      .text('x')
      .addClass('reset')
      .click(() => {
        const def = setting.default ?? '';
        el.val(def); // Manually change
        setting.update(undefined); // Remove and trigger events
      });
    ret.append(' ', reset);
  }

  const description = $('<div>').addClass('setting-description');
  ret.append(description);
  ret.append(container);

  function refresh() {
    // TODO: hidden is technically dynamic
    // TODO: reset is technically dynamic
    el.prop('disabled', setting.disabled);
    label.toggleClass('disabled', setting.disabled);
    label.html(setting.name);
    const text = setting.description;
    description.html(text).toggle(!!text);
  }
  refresh();
  untilClose(`refresh:${key}`, refresh, `create:${key}`);

  return ret;
}

function getMessage(page) {
  const container = $('<div>');
  const pageSettings = configs.get(page).settings;
  const categories = {};
  function createCategory(name) {
    const set = $('<fieldset>');
    categories[name] = set;
    if (name !== 'N/A') {
      set.append($('<legend>').html(translateText(name)));
    }
    container.append(set);
    return set;
  }
  function category(name = 'N/A') {
    return categories[name] || createCategory(name);
  }
  category();
  each(pageSettings, (data = defaultSetting) => wrap(() => {
    let element = createSetting(data);
    category(data.category).append(element);

    function refresh() {
      if (updateLock === data) { // Setting is updating itself
        updateLock = false; // Only block the first update
        return;
      }
      const newElement = createSetting(data);
      element.replaceWith(newElement);
      element = newElement;
    }
    untilClose(data.key, refresh);
  }, data.key, getLogger(data)));
  if (!category('N/A').html()) {
    category('N/A').remove();
  }
  return container;
}

function showSetting(key, scroll) {
  const setting = settingReg[key];
  if (!setting) return;
  const opening = !isOpen();
  open(setting.page);
  if (!scroll) return;
  if (opening) {
    events.once('open', () => events.emit(`scroll:${key}`));
  } else {
    events.emit(`scroll:${key}`);
  }
}

export function register(data) {
  if (typeof data !== 'string' && !data.key) throw new Error('No key provided');

  const key = (data.key || data); // .replace(/ /g, '_'); // This is a breaking change (but possibly necessary)
  if (settingReg[key]) throw new Error(`${settingReg[key].name}[${key}] already registered`);

  const page = pageToken(data.page || 'main', data.tab);
  const setting = {
    ...(typeof data === 'object' && data),
    events,
    key,
    page,
    type: data.type || registry.get('boolean'),
  };

  const slider = (data.min || data.max || data.step) !== undefined;
  if (!data.type) {
    if (data.options) {
      setting.type = 'select';
      setting.data ??= data.options; // This is a fallback for when things don't get updated correctly, or just relying on the text type
    } else if (slider) {
      setting.type = 'slider';
    }
  }
  if (slider) {
    setting.data = {
      min: data.min,
      max: data.max,
      step: data.step,
      ...setting.data, // Override any values, if any were provided by lazy developers
    };
  } else if (setting.type === 'select' && !setting.data && data.options) {
    setting.data = data.options;
  }

  if (!isSettingType(setting.type)) {
    switch (typeof setting.type) {
      case 'string':
        setting.type = registry.get(setting.type);
        break;
      case 'object':
        try {
          const left = data.type.key || data.type.left || data.type[0];
          const right = data.type.value || data.type.right || data.type[1];
          const type = new AdvancedMap(left, right);
          setting.type = type;
          registerTypeStyle(type);
        } catch (e) {
          const logger = data.page?.logger || console;
          logger.error('Error setting up AdvancedMap', e);
          setting.type = undefined;
        }
        break;
      default: break;
    }
  }
  if (!isSettingType(setting.type)) return undefined; // TODO: Throw error?

  const conf = init(page);

  const registeredSetting = new RegisteredSetting(setting);
  conf.settings[key] = registeredSetting;
  settingReg[key] = registeredSetting;
  return {
    get key() { return key; },
    value: () => registeredSetting.value,
    set: (val) => registeredSetting.update(val),
    on: (func) => {
      events.on(key, func);
    },
    get disabled() { return registeredSetting.disabled; },
    show(scroll) {
      showSetting(key, scroll);
    },
    refresh: () => {
      events.emit(`refresh:${key}`);
    },
  };
}

export function open(page = 'main', tab = undefined) {
  const target = pageToken(page, tab);
  const test = target.name || target;
  if (typeof test !== 'string') throw new Error(`Attempted to open unknown page, ${test} (${typeof target})`);
  getPage(target).setActive();
  const plugin = target.plugin ?? (pluginViews.has(target) ? target : undefined);
  if (plugin) {
    const view = getPluginView(plugin);
    view.tab.setActive();
    view.tab.refresh();
  }
  if (plugin || target.name) {
    const plugins = getPage('Plugins');
    plugins.setActive();
    plugins.refresh();
  }
  getScreen().render(true);
  if (isOpen()) return;
  dialog.open({
    title: `${Translation.Setting('title')}`,
    cssClass: 'underscript-dialog settings',
    message() {
      const container = document.createElement('div');
      container.classList.add('settings-search-container');
      container.append(
        createSearch(showSetting, settingReg, dialog).el,
        getScreen().render(true),
      );
      return container;
    },
  });
}

export function setDisplayName(name, page = 'main') {
  if (name) {
    init(page).name = name;
    getPage(page).setName(translateText(name));
    pluginViews.get(page)?.tab.setName(translateText(name));
    return true;
  }
  return false;
}

export function setMainName(plugin, name) {
  if (!name) return false;
  init(plugin).mainName = name;
  pluginViews.get(plugin)?.main.setName(translateText(name));
  return true;
}

export function isOpen() {
  return dialog.isOpen();
}

export function value(key) {
  const setting = settingReg[key];
  if (setting) {
    return setting.value;
  }
  return localStorage.getItem(key);
}

export function remove(key) {
  const setting = settingReg[key];
  if (!setting) return;
  removeSetting(setting, $(`[id='${key}']`));
}

function removeSetting(setting, el) {
  const { key, page } = setting;
  localStorage.removeItem(key);
  // Remove references
  delete configs.get(page).settings[key];
  delete settingReg[key];
  // If we're on the setting screen, remove the setting
  if (el) {
    el.parent().remove();
  }
}

export function exists(key) {
  return key in settingReg;
}

function portableFilter() {
  return createFilter(Object.values(settingReg));
}

export function exportSettings() {
  return serialize(localStorage, portableFilter());
}

export function parseSettings(string) {
  return parse(string, portableFilter());
}

export function importSettings(string) {
  const result = parseSettings(string);
  each(result.accepted, (val, key) => {
    localStorage.setItem(key, val);
  });
  return result;
}

init('main');

// Add our button last
eventManager.once(':menu:opening', () => {
  const note = Translation.Menu('settings.note');
  menu.addButton({
    text: Translation.Menu('settings'),
    action: () => {
      open('main');
    },
    enabled() {
      return typeof BootstrapDialog !== 'undefined';
    },
    note() {
      if (!this.enabled()) {
        return note;
      }
      return undefined;
    },
  });
});

export function on(...args) {
  events.on(...args);
}

export function registerType(type, addStyle = style.add) {
  if (!isSettingType(type)) throw new Error(`SettingType: Tried to register object of: ${typeof type}`);
  const name = type.name;
  if (!name || registry.has(name)) throw new Error(`SettingType: "${name}" already exists`);
  registry.set(name, type);
  registerTypeStyle(type, addStyle);
}

function registerTypeStyle(type, addStyle = style.add) {
  if (type instanceof AdvancedMap && type.isRegistered) return;
  addStyle(...type.styles().map((s) => `.underscript-dialog .${getCSSName(type.name)} ${s}`));
}

each(types, (Type) => registerType(new Type()));

function getCSSName(name = '', prefix = 'setting-') {
  return `${prefix}${name.replaceAll(/[^_a-zA-Z0-9-]/g, '-')}`;
}

function untilClose(key, callback, ...extra) {
  events.on(key, callback);
  events.once(['close', ...extra].join(' ').trim(), () => {
    events.off(key, callback);
  });
}

function getLogger({ page } = defaultSetting) {
  return page.logger || console;
}

dialog.onOpen((diag) => {
  events.emit('open');
  eventManager.emit('Settings:open', diag.getModalBody());
});

dialog.onClose(() => {
  events.emit('close');
  getScreen().refresh();
});

eventManager.on('translation:loaded', () => {
  configs.forEach((config, key) => {
    if (!config.name || !config.page) return;
    const name = translateText(config.name);
    const view = pluginViews.get(key);
    config.page.setName(view && config.mainName ? translateText(config.mainName) : name);
    view?.tab.setName(name);
  });
});
