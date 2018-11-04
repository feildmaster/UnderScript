const settings = (() => {
  const configs = {};
  let dialog = null;

  function init(page) {
    if (!configs.hasOwnProperty(page)) {
      configs[page] = {
        name: page === 'main' ? 'UnderScript' : page,
        settings: {},
      };
    }
    return configs[page];
  }

  function createSetting(setting) {
    const ret = $('<div>');
    const key = setting.key;
    const current = localStorage.getItem(key);
    let el;
    if (setting.type === 'boolean') {
      el = $(`<input type="checkbox" id="${key}">`)
        .prop('checked', !!current);
    } else if (setting.type === 'select') {
      el = $(`<select id="${key}">`);
      setting.options.forEach((v) => {
        el.append(`<option value="${v}"${current === v ? ' selected' : ''}>${v}</option>`);
      });
    } else { // How to handle.
      return null;
    }
    el.on('change.script', (e) => {
      setting.onChange($(e.target));
    });
    const label = $(`<label for="${key}">`).html(setting.name);
    ret.append(el, ' ', label);
    if (setting.note) {
      const note = typeof setting.note === 'function' ? setting.note() : setting.note;
      if (note) { // Functions can return null
        ret.hover(hover.show(note));
      }
    }
    return ret;
  }

  function get(d) {
    const page = d.getData('page');
    const container = $('<div>');
    const pageSettings = configs[page].settings;
    Object.keys(pageSettings).forEach((key) => {
      container.append(createSetting(pageSettings[key]));
    });
    return container;
  }

  function add(data) {
    if (!data) return false;
    const page = data.page || 'main';
    const setting = {
      key: data.key || data,
      name: data.name || setting.key,
      type: data.type || 'boolean',
      note: data.note,
      default: data.default,
      options: data.options,
    };
    const conf = init(page);
    if (conf.hasOwnProperty(setting.name)) {
      debug(`settings.add: ${setting.name} already registered`);
      return false;
    }
    setting.onChange = (el) => {
      let val = '';
      if (setting.type === 'boolean') {
        if (el.is(':checked')) val = '1';
        else val = false;
      } else if (setting.type === 'select') {
        val = el.val();
      } else {
        debug(`Unknown Setting Type: ${setting.type}`);
        return;
      }
      if (val === false) {
        localStorage.removeItem(setting.key);
      } else {
        localStorage.setItem(setting.key, val);
      }
    };
    init(page).settings[setting.name] = setting;
    return true;
  }

  function buttons(page) {
    debug('Settings#buttons');
    const buttons = [];
    Object.keys(configs).forEach((key) => {
      if (key === page) return;
      buttons.push({
        label: configs[key].name,
        action: () => {
          close();
          open(key);
        },
      });
    });
    buttons.push({
      label: 'Close',
      action: close,
    });
    return buttons;
  }

  function open(page = 'main') {
    const displayName = configs[page].name;
    dialog = BootstrapDialog.show({
      title: `UnderScript Configuration${page !== 'main' ? `: ${displayName}` : ''}`,
      message: get,
      data: { page },
      buttons: buttons(page),
    });
  }

  function setDisplayName(name, page = 'main') {
    if (name && configs.hasOwnProperty(page)) {
      configs[page].name = name;
      return true;
    }
    return false;
  }

  function close() {
    if (dialog) {
      dialog.close();
      dialog = null;
    }
  }

  return {
    open, close, setDisplayName,
    register: add,
  };
})();
