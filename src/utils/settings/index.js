import Translation from 'src/structures/constants/translation.js';
import eventManager from '../eventManager.js';
import eventEmitter from '../eventEmitter.js';
import style from '../style.js';
import * as menu from '../menu.js';
import tabManager from '../tabbedView.js';
import * as hover from '../hover.js';
import each from '../each.js';
import wrap from '../2.pokemon.js';
import AdvancedMap from './types/map2.js';
import * as types from './types/index.js';
import { translateText } from '../translate.js';
import RegisteredSetting from './RegisteredSetting.js';
import styles from './settings.css';
import { isSettingType, registry } from './settingRegistry.js';
import DialogHelper from '../DialogHelper.js';

const defaultSetting = new RegisteredSetting();

style.add(styles.split('\n\n'));

/**
 * @type {{[key: string]: RegisteredSetting}}
 */
const settingReg = {
  // key: setting
};
const events = eventEmitter();
const configs = new Map();
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
  ret.append(container);

  function refresh() {
    // TODO: hidden is technically dynamic
    // TODO: reset is technically dynamic
    el.prop('disabled', setting.disabled);
    label.toggleClass('disabled', setting.disabled);
    label.html(setting.name);
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

export function register(data) {
  if (typeof data !== 'string' && !data.key) throw new Error('No key provided');

  const key = (data.key || data); // .replace(/ /g, '_'); // This is a breaking change (but possibly necessary)
  if (settingReg[key]) throw new Error(`${settingReg[key].name}[${key}] already registered`);

  const page = data.page || 'main';
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
      const opening = !isOpen();
      open(page, key);
      if (!scroll) return;
      if (opening) {
        events.once('open', () => events.emit(`scroll:${key}`));
      } else {
        events.emit(`scroll:${key}`);
      }
    },
    refresh: () => {
      events.emit(`refresh:${key}`);
    },
  };
}

export function open(page = 'main') {
  const test = page.name || page;
  if (typeof test !== 'string') throw new Error(`Attempted to open unknown page, ${test} (${typeof page})`);
  getPage(page).setActive();
  if (page.name) {
    getPage('Plugins').setActive();
  }
  if (isOpen()) {
    getScreen().render(true);
    return;
  }
  dialog.open({
    title: `${Translation.Setting('title')}`,
    // size: 'size-wide',
    message() {
      return getScreen().render(true);
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
});

// TODO: translate page titles on ready
