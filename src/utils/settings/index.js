import eventManager from '../eventManager.js';
import eventEmitter from '../eventEmitter.js';
import style from '../style.js';
import * as menu from '../menu.js';
import tabManager from '../tabbedView.js';
import * as hover from '../hover.js';
import each from '../each.js';
import wrap from '../2.pokemon.js';
import SettingType from './types/setting.js';
import * as types from './types/index.js';
import { translateText } from '../translate.js';
import RegisteredSetting from './RegisteredSetting.js';
import styles from './settings.css';

const defaultSetting = new RegisteredSetting();

style.add(styles.split('\n\n'));

/**
 * @type {{[key: string]: RegisteredSetting}}
 */
const settingReg = {
  // key: setting
};
/**
 * @type {Map<string, SettingType>}
 */
const registry = new Map();
const events = eventEmitter();
const configs = new Map();
let dialog = null;

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
  const tab = screen.addTab('Plugins', screen.plugins);
  tab.setEnd(true); // Plugins go to the bottom of the list
  configs.set('Plugins', {
    page: tab,
  });

  getScreen.screen = screen;
  return screen;
}

function getPage(key) {
  const config = configs.get(key);
  if (config && config.page) {
    return config.page;
  }

  function builder() {
    return getMessage(key)[0];
  }
  const screen = key.name ? getScreen().plugins : getScreen();
  const name = key.name || key;
  const tab = screen.addTab(name, builder);
  return tab;
}

function init(page) {
  if (!configs.has(page)) {
    const name = page === 'main' ? 'UnderScript' : page.name || page;
    const data = {
      name,
      settings: {},
      page: getPage(page),
    };
    data.page.setName(name);
    configs.set(page, data);
  }
  return configs.get(page);
}

function createSetting(setting = defaultSetting) {
  if (setting.hidden) return null;
  const ret = $('<div>').addClass('flex-start');
  const { key, type } = setting;
  ret.addClass(getCSSName(type.name));
  const current = value(key);
  const container = $(`<div>`).addClass('flex-stretch');
  const el = $(type.element(current, (...args) => setting.update(...args), {
    data: setting.data,
    remove: setting.remove,
    container,
    key,
    removeSetting() {
      removeSetting(setting, el);
    },
  }));
  el.attr({
    id: key,
  });

  const label = $(`<label for="${key}">`).html(translateText(setting.name));
  // TODO: Allow disabling progmatically, not just on setting load
  if (setting.disabled) {
    el.prop('disabled', true);
    label.addClass('disabled');
  }
  const labelPlacement = type.labelFirst();
  if (labelPlacement) {
    ret.append(label, ' ', el);
  } else if (labelPlacement !== null) {
    ret.append(el, ' ', label);
  } else {
    ret.append(el);
  }

  ret.hover((e) => {
    const note = setting.note;
    if (!note || setting.disabled) return undefined;
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
  ret.append(container);
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
  each(pageSettings, (data) => {
    category(data.category).append(createSetting(data));
  });
  if (!category('N/A').html()) {
    category('N/A').remove();
  }
  return container;
}

export function register(data) {
  if (typeof data !== 'string' && !data.key) throw new Error('No key provided');

  const page = data.page || 'main';
  const key = (data.key || data); // .replace(/ /g, '_'); // This is a breaking change (but possibly necessary)
  const setting = {
    ...(typeof data === 'object' && data),
    events,
    key,
    page,
    type: data.type || registry.get('boolean'),
  };

  if (settingReg[key]) throw new Error(`${settingReg[key].name}[${key}] already registered`);

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
  if (typeof setting.type === 'string') {
    setting.type = registry.get(setting.type);
  }
  if (!(setting.type instanceof SettingType)) return undefined; // TODO: Throw error?

  const conf = init(page);

  const registeredSetting = new RegisteredSetting(setting);
  conf.settings[key] = registeredSetting;
  settingReg[key] = registeredSetting;
  return {
    get key() { return key; },
    value: () => registeredSetting.value,
    // TODO: This ruins dynamic values such as arrays
    set: (val) => registeredSetting.update(val),
    on: (func) => {
      events.on(key, func);
    },
    get disabled() { return registeredSetting.disabled; },
    show: () => open(page, key),
  };
}

export function open(page = 'main') {
  const test = page.name || page;
  if (typeof test !== 'string') throw new Error(`Attempted to open unknown page, ${test} (${typeof page})`);
  getPage(page).setActive();
  if (page.name) {
    getPage('Plugins').setActive();
  }
  if (isOpen()) return;
  BootstrapDialog.show({
    title: `UnderScript Configuration`,
    // size: 'size-wide',
    message() {
      return getScreen().render(true);
    },
    cssClass: 'mono underscript-dialog',
    buttons: [{
      label: 'Close',
      action: close,
    }],
    onshown: (diag) => {
      dialog = diag;
      events.emit('open');
    },
    onhidden: () => {
      dialog = null;
      events.emit('close');
    },
  });
}

export function setDisplayName(name, page = 'main') {
  if (name) {
    init(page).name = name;
    getPage(page).setName(name);
    return true;
  }
  return false;
}

export function close() {
  if (isOpen()) {
    dialog.close();
    dialog = null;
  }
}

export function isOpen() {
  return dialog !== null;
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

export function exportSettings() {
  const localSet = {};
  const extras = ['underscript.notice.'];
  const skip = [];
  let used = false;
  each(settingReg, (setting) => {
    const { key, extraPrefix, exportable } = setting;
    if (!exportable) {
      skip.push(key);
      return;
    }
    const val = localStorage.getItem(key);
    if (val !== null) {
      used = true;
      localSet[key] = val;
    }
    // By checking against prefixes later we cut on iterations
    if (extraPrefix) {
      extras.push(extraPrefix);
    }
  });
  each(localStorage, (val, key) => {
    if (localSet[key] !== undefined || skip.includes(key)) return;
    used |= extras.some((prefix) => {
      if (key.startsWith(prefix)) {
        localSet[key] = val;
        return true;
      }
      return false;
    });
  });
  return used ? btoa(JSON.stringify(localSet)) : '';
}

export function importSettings(string) {
  wrap(() => {
    // TODO: Call setting events?
    const parsed = JSON.parse(atob(string));
    each(parsed, (val, key) => {
      localStorage.setItem(key, val);
    });
  });
}

init('main');

// Add our button last
eventManager.once(':menu:opening', () => {
  menu.addButton({
    text: 'Settings',
    action: () => {
      open('main');
    },
    enabled() {
      return typeof BootstrapDialog !== 'undefined';
    },
    note() {
      if (!this.enabled()) {
        return 'Settings temporarily unavailable';
      }
      return undefined;
    },
  });
});

export function on(...args) {
  events.on(...args);
}

export function registerType(type, addStyle = style.add) {
  if (!(type instanceof SettingType)) throw new Error(`SettingType: Tried to register object of: ${typeof type}`);
  const name = type.name;
  if (!name || registry.has(name)) throw new Error(`SettingType: "${name}" already exists`);
  registry.set(name, type);
  addStyle(...type.styles().map((s) => `.underscript-dialog .${getCSSName(name)} ${s}`));
}

each(types, (Type) => registerType(new Type()));

function getCSSName(name = '', prefix = 'setting-') {
  return `${prefix}${name.replaceAll(/[^_a-zA-Z0-9-]/g, '-')}`;
}
