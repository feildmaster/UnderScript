import eventManager from '../eventManager';
import eventEmitter from '../eventEmitter';
import style from '../style';
import * as menu from '../menu';
import tabManager from '../tabbedView';
import * as hover from '../hover';
import each from '../each';
import wrap from '../2.pokemon';
import SettingType from './setting';
import * as types from './types';

const defaultType = new SettingType('generic');

style.add(
  '.flex-stretch { flex-basis: 100%; }',
  '.flex-start { display: flex; align-items: flex-start; flex-wrap: wrap; }',
  '.flex-start > label + * { margin-left: 7px; }',
  '.flex-start > input { margin-right: 4px; }',
  '.mono .modal-body { font-family: monospace; max-height: 500px; overflow-y: auto; }',
  '.underscript-dialog .bootstrap-dialog-message { display: flex; }',
  // '.underscript-dialog .modal-content { background: #000 url(../images/backgrounds/2.png) -380px -135px; }',
  // '.underscript-dialog .modal-content .modal-header, .underscript-dialog .modal-body { background-color: transparent; }',
  '.underscript-dialog .modal-footer button.btn { margin-bottom: 5px; }',
  // TODO: convert reset to a type? for convenience
  '.underscript-dialog .reset:hover { cursor: pointer; font-weight: bold; }',
  '.underscript-dialog .reset:before { content: "["; }',
  '.underscript-dialog .reset:after { content: "]"; }',
);

const settingReg = {
  // key: setting
};
const registry = new Map();
const events = eventEmitter();
const configs = new Map();
let dialog = null;

/**
 * @returns {tabManager}
 */
function getScreen() {
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

function createSetting(setting = {
  key: '',
  type: defaultType,
}) {
  if (setting.hidden) return null;
  const ret = $('<div>').addClass('flex-start');
  const { key, type } = setting;
  const current = value(key);
  const container = $(`<div>`).addClass('flex-stretch');
  const el = $(type.element(current, setting.update, {
    data: setting.data,
    remove: setting.remove,
    container,
    key,
  }));
  el.attr({
    id: key,
  });
  const label = $(`<label for="${key}">`).html(setting.name);
  // TODO: Allow disabling progmatically, not just on setting load
  const disabled = (typeof setting.disabled === 'function' ? setting.disabled() : setting.disabled) === true;
  if (disabled) {
    el.prop('disabled', true);
    label.css({
      color: '#666',
      cursor: 'not-allowed',
    });
  }
  const labelPlacement = type.labelFirst();
  if (labelPlacement) {
    ret.append(label, ' ', el);
  } else if (labelPlacement !== null) {
    ret.append(el, ' ', label);
  } else {
    ret.append(el);
  }
  if (setting.note) {
    ret.hover((e) => {
      const note = setting.note();
      if (!note || disabled) return undefined;
      return hover.show(note)(e);
    }, hover.hide);
  }
  if (setting.reset) {
    const reset = $('<span>')
      .text('x')
      .addClass('reset')
      .click(() => {
        const def = getDefault(setting);
        el.val(def === null ? '' : def); // Manually change
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
    const set = $('<fieldset>').css({
      padding: '.35em .625em .75em',
      margin: '0 2px',
      border: '1px solid silver',
    });
    categories[name] = set;
    if (name !== 'N/A') {
      set.append($('<legend>').css({
        padding: 0,
        border: 0,
        width: 'auto',
        margin: 0,
        'font-family': 'DTM-Mono',
        color: 'white',
      }).html(name));
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
  if (typeof data !== 'string' && !data.key) return false;
  const page = data.page || 'main';
  const key = (data.key || data); // .replace(/ /g, '_'); // This is a breaking change (but possibly necessary)
  const setting = {
    page,
    key,
    name: data.name || key,
    type: data.type || registry.get('boolean'),
    category: data.category,
    disabled: data.disabled === true,
    default: data.default,
    data: data.data,
    hidden: data.hidden === true,
    pseudo: data.pseudo === true, // TODO: What does this do...?
    remove: data.remove === true,
    exportable: data.export !== false,
    extraPrefix: data.extraPrefix,
    reset: data.reset === true,
  };
  if (settingReg[key]) {
    // debug(`settings.add: ${setting.name}[${key}] already registered`);
    return false;
  }
  const slider = data.min || data.max || data.step;
  if (!data.type) {
    if (data.options) {
      setting.type = 'select';
      setting.data = data.data || data.options; // This is a fallback for when things don't get updated correctly, or just relying on the text type
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
  if (!(setting.type instanceof SettingType)) return false; // TODO: Throw error?
  if (data.refresh || data.note) {
    setting.note = () => {
      const notes = [];
      const note = typeof data.note === 'function' ? data.note() : data.note;
      if (note) notes.push(note);
      if (data.refresh) {
        if (typeof data.refresh === 'function' ? data.refresh() : data.refresh) {
          notes.push('Will require you to refresh the page');
        }
      }
      return notes.join('<br>');
    };
  }
  const conf = init(page);
  function update(val) {
    const prev = value(key);
    if (val === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, setting.type.encode(val));
    }
    if (typeof data.onChange === 'function') {
      data.onChange(value(key), prev);
    }
    events.emit(key, val, prev);
    events.emit('setting:change', key, val, prev);
  }
  if (typeof data.converter === 'function') {
    const current = localStorage.getItem(key);
    if (typeof current === 'string') {
      const converted = data.converter(current);
      if (converted === null) {
        localStorage.removeItem(key);
      } else if (converted !== undefined) {
        localStorage.setItem(key, converted);
      }
    }
  }
  setting.update = update;
  conf.settings[key] = setting;
  settingReg[key] = setting;
  return {
    get key() { return key; },
    value: () => value(key),
    set: update, // TODO: This ruins dynamic values such as arrays
    on: (func) => {
      events.on(key, func);
    },
    get disabled() { return setting.disabled; },
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
    },
    onhidden: () => {
      dialog = null;
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
  const val = localStorage.getItem(key);
  if (!val) return getDefault(setting);
  if (setting) return setting.type.value(val);
  return val;
}

function getDefault(setting = {
  type: defaultType,
}) {
  if (setting.default) {
    const val = typeof setting.default === 'function' ? setting.default() : setting.default;
    return setting.type.value(val);
  }
  return setting.type.default(setting.data);
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

export function exportSettings() {
  const localSet = {};
  const extras = ['underscript.notice.', 'underscript.plugin.'];
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
  addStyle(...type.styles().map((s) => `.underscript-dialog ${s}`));
}

each(types, (Type) => registerType(new Type()));
