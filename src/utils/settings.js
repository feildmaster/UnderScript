const settings = (() => {
  eventManager.on('UnderScript:loaded', () => style.add(
    '.mono .modal-body { font-family: monospace; max-height: 500px; overflow-y: auto; }',
    '.remove { display: none; }',
    '.remove:checked + label:before { content: "× "; color: red; }',
  ));
  const settingReg = {
    // key: setting
  };
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

  function createArrayItem(text, skey) {
    const key = `${skey}.${text}`;
    const ret = $('<div>')
      .on('change.script', () => {
        const v = value(skey);
        const i = v.indexOf(text);
        if (i > -1) {
          v.splice(i, 1);
          if (v.length) {
            localStorage.setItem(skey, JSON.stringify(v));
          } else {
            localStorage.removeItem(skey);
          }
        }
        ret.remove();
      });
    const el = $('<input>')
      .addClass('remove')
      .attr({
        type: 'checkbox',
        id: key,
      }).prop('checked', '1');
    const label = $(`<label>`).html(text)
      .attr({
        for: key,
      });
      ret.append(el, ' ', label);
    return ret;
  }

  function createSetting(setting) {
    if (setting.hidden) return;
    const ret = $('<div>');
    const key = setting.key;
    const current = localStorage.getItem(key) || getDefault(setting);
    let el, lf;
    if (setting.type === 'boolean') {
      el = $(`<input type="checkbox" >`)
        .prop('checked', current === '1' || current === true);
    } else if (setting.type === 'select') {
      el = $(`<select>`);
      lf = true;
      setting.options.forEach((v) => {
        el.append(`<option value="${v}"${current === v ? ' selected' : ''}>${v}</option>`);
      });
    } else if (setting.type === 'remove') {
      el = $(`<input type="checkbox">`)
        .addClass('remove')
        .prop('checked', true);
    } else if (setting.type === 'array') {
      lf = true;
      el = $('<input type="text">');
    } else if (setting.type === 'slider') {
      lf = true;
      el = $('<input>').attr({
        type: 'range',
        min: setting.min || 0,
        max: setting.max || 100,
        value: current,
      });
    } else { // How to handle.
      return null;
    }
    if (['array'].includes(setting.type)) {
      el.css({
        'background-color': 'transparent',
      });
    }
    el.attr({
      id: key,
    });
    function callChange(e) {
      setting.onChange($(e.target));
    }
    switch (setting.type) {
      default: break;
      case 'boolean':
      case 'select':
      case 'remove':
        el.on('change.script', callChange);
        break;
      case 'input':
      case 'array':
        el.on('keydown.script', (e) => {
          if (e.which !== 13) return;
          e.preventDefault();
          callChange(e);
          el.val('');
        });
        break;
      case 'slider':
        el.on('input.script', callChange);
        break;
    }
    const label = $(`<label for="${key}">`).html(setting.name);
    const disabled = (typeof setting.disabled === 'function' ? setting.disabled() : setting.disabled) === true;
    if (disabled) {
      el.prop('disabled', true);
      label.css({
        color: '#666',
        cursor: 'not-allowed',
      });
    }
    if (lf) {
      ret.append(label, ' ', el);
    } else {
      ret.append(el, ' ', label);
    }
    if (!disabled && setting.note) {
      const note = setting.note();
      if (note) { // Functions can return null
        ret.hover(hover.show(note));
      }
    }
    if (setting.type === 'array') { // This is basically a fieldset, but not
      const values = $('<div>').attr({
        id: `${key}.values`,
      });
      value(setting.key).forEach((val) => {
        values.append(createArrayItem(val, setting.key));
      });
      ret.append(values);
    }
    return ret;
  }

  function getMessage(d) {
    const page = d.getData('page');
    const container = $('<div>');
    const pageSettings = configs[page].settings;
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
    fn.each(pageSettings, (data) => {
      category(data.category).append(createSetting(data));
    });
    if (!category('N/A').html()) {
      category('N/A').remove();
    }
    return container;
  }

  function add(data) {
    if (!data) return false;
    const page = data.page || 'main';
    const setting = {
      page,
      key: data.key || data,
      name: data.name || data.key,
      type: data.type || 'boolean',
      category: data.category,
      disabled: data.disabled,
      default: data.default,
      options: data.options,
      hidden: !!data.hidden,
      pseudo: !!data.pseudo,
      remove: !!data.remove,
      exportable: data.export !== false,
      extraPrefix: data.extraPrefix,
    };
    if (data.refresh || data.note) {
      setting.note = () => {
        if (data.refresh) {
          if (typeof data.refresh === 'function' ? data.refresh() : data.refresh) {
            return 'Will require you to refresh the page';
          }
        }
        return typeof data.note === 'function' ? data.note() : data.note;
      };
    }
    const conf = init(page);
    if (conf.hasOwnProperty(setting.key)) {
      debug(`settings.add: ${setting.name} already registered`);
      return false;
    }
    setting.onChange = (el) => {
      let val = '';
      if (setting.type === 'boolean') {
        if (el.is(':checked')) val = '1';
        else if (setting.remove) val = false; // Only remove if it's expected
        else val = '0';
      } else if (setting.type === 'select') {
        val = el.val();
      } else if (setting.type === 'remove') {
        val = false;
        removeSetting(setting, el);
      } else if (setting.type === 'array') {
        const v = value(setting.key);
        const i = el.val().trim();
        if (!i || v.includes(i)) return;
        v.push(i);
        $(document.getElementById(`${setting.key}.values`)).append(createArrayItem(i, setting.key));
        val = JSON.stringify(v); // TODO: better handling of val storage
      } else {
        debug(`Unknown Setting Type: ${setting.type}`);
        return;
      }
      if (typeof data.onChange === 'function') {
        data.onChange(val, localStorage.getItem(setting.key));
      }
      if (val === false) {
        localStorage.removeItem(setting.key);
      } else {
        localStorage.setItem(setting.key, val);
      }
    };
    conf.settings[setting.key] = setting;
    if (!settingReg.hasOwnProperty(setting.key)) {
      settingReg[setting.key] = setting;
    }
    return true;
  }

  function buttons(page) {
    const buttons = [];
    fn.each(configs, ({ name }, key) => {
      if (key === page) return;
      buttons.push({
        label: name,
        action: (dialog) => {
          dialog.close();
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
    if (typeof page !== 'string') throw new Error(`Attempted to open ${typeof page}`);
    const displayName = configs[page].name;
    BootstrapDialog.show({
      title: `UnderScript Configuration${page !== 'main' ? `: ${displayName}` : ''}`,
      message: getMessage,
      cssClass: 'mono',
      data: { page },
      buttons: buttons(page),
      onshown: (diag) => {
        dialog = diag;
      },
      onhidden: () => {
        dialog = null;
      },
    });
  }

  function setDisplayName(name, page = 'main') {
    if (name) {
      init(page).name = name;
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

  function isOpen() {
    return dialog !== null;
  }

  function value(key) {
    const setting = settingReg[key];
    const val = localStorage.getItem(key);
    if (!val) return getDefault(setting);
    else if (!setting || setting.type === 'boolean') return val === '1' || val === 'true';
    else if (setting.type === 'array') return JSON.parse(val);
    else return val;
  }

  function getDefault(setting = {}) {
    if (setting.default) {
      if (setting.type === 'boolean') {
        return !!setting.default;
      }
      return setting.default;
    } else if (setting.type === 'select') {
      return setting.options[0];
    } else if (setting.type === 'array') {
      return [];
    }
    return null;
  }

  function remove(key)  {
    const setting = settingReg[key];
    if (!setting) return;
    removeSetting(setting, $(`[id='${key}']`));
  }

  function removeSetting(setting, el) {
    const { key, page } = setting;
    localStorage.removeItem(key);
    // Remove references
    delete configs[page].settings[key];
    delete settingReg[key];
    // If we're on the setting screen, remove the setting
    if (el) {
      el.parent().remove();
    }
  }

  function exportSettings() {
    const settings = {};
    const extras = ['underscript.notice.'];
    let used = false;
    fn.each(settingReg, (setting) => {
      if (!setting.exportable) return;
      const { key, extraPrefix } = setting;
      const value = localStorage.getItem(key);
      if (value !== null) {
        used = true;
        settings[key] = value;
      }
      // By checking against prefixes later we cut on iterations
      if (extraPrefix) {
        extras.push(extraPrefix);
      }
    });
    Object.entries(localStorage).forEach(([key, value]) => {
      if (settings.hasOwnProperty(key)) return;
      used |= extras.some((prefix) => {
        if (key.startsWith(prefix)) {
          settings[key] = value;
          return true;
        }
      });
    });
    return used ? btoa(JSON.stringify(settings)) : '';
  }

  function importSettings(string) {
    try {
      // TODO
    } catch(e) {
    }
  }

  // Add our button last
  eventManager.on('UnderScript:loaded', () => {
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
      }
    });
  });

  return {
    open, close, setDisplayName, isOpen, value, remove,
    register: add,
    export: exportSettings,
    import: importSettings,
  };
})();
