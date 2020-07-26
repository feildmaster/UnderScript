const settings = wrap(() => {
  eventManager.on(':utils', () => style.add(
    '.flex-start { display: flex; align-items: flex-start; }',
    '.flex-start input[type="range"] { flex-grow: 1; }',
    '.flex-start > label + * { margin-left: 7px; }',
    '.flex-start > input { margin-right: 4px; }',
    '.mono .modal-body { font-family: monospace; max-height: 500px; overflow-y: auto; }',
    '.underscript-dialog .remove { display: none; }',
    '.underscript-dialog .remove:checked + label:before { content: "× "; color: red; }',
    // '.underscript-dialog .modal-content { background: #000 url(../images/backgrounds/2.png) -380px -135px; }',
    // '.underscript-dialog .modal-content .modal-header, .underscript-dialog .modal-body { background-color: transparent; }',
    '.underscript-dialog .modal-footer button.btn { margin-bottom: 5px; }',
    '.underscript-dialog input[type="color"] { width: 16px; height: 18px; padding: 0 1px; }',
    '.underscript-dialog input[type="color"]:hover { border-color: #00b8ff; cursor: pointer; }',
    '.underscript-dialog .reset:hover { cursor: pointer; font-weight: bold; }',
    '.underscript-dialog .reset:before { content: "["; }',
    '.underscript-dialog .reset:after { content: "]"; }',
    '.underscript-dialog input[type="range"] { display: inline; width: 200px; vertical-align: middle; }',
    // '.underscript-dialog input[type="range"]:after { content: attr(value); }',
  ));
  const settingReg = {
    // key: setting
  };
  const events = fn.eventEmitter();
  const configs = {};
  let dialog = null;

  function init(page) {
    if (!Object.prototype.hasOwnProperty.call(configs, page)) {
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
          localStorage.setItem(skey, JSON.stringify(v));
          // TODO: Call event. Value changed
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
    if (setting.hidden) return null;
    const ret = $('<div>').addClass('flex-start');
    const key = setting.key;
    const current = localStorage.getItem(key) || getDefault(setting);
    let el;
    let lf = true;
    if (setting.type === 'boolean') {
      lf = false;
      el = $(`<input type="checkbox" >`)
        .prop('checked', current === '1' || current === true);
    } else if (setting.type === 'text') {
      el = $('<input type="text">')
        .val(current);
    } else if (setting.type === 'password') {
      el = $('<input type="password">')
        .val(current);
    } else if (setting.type === 'select') {
      el = $(`<select>`);
      lf = true;
      setting.options.forEach((v) => {
        el.append(`<option value="${v}"${current === v ? ' selected' : ''}>${v}</option>`);
      });
    } else if (setting.type === 'remove') {
      lf = false;
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
        min: setting.min,
        max: setting.max,
        step: setting.step,
      }).val(current);
    } else if (setting.type === 'color') {
      // lf = true;
      lf = false;
      el = $('<input>').attr({
        type: 'color',
        value: current,
      });
    } else { // How to handle.
      return null;
    }
    if (['array', 'text', 'password'].includes(setting.type)) {
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
      case 'color':
      case 'slider':
        el.on('change.script', callChange);
        break;
      case 'text':
      case 'password':
        el.on('blur.script', callChange);
        break;
      case 'input': // This type doesn't exist
      case 'array':
        el.on('keydown.script', (e) => {
          if (e.which !== 13) return;
          e.preventDefault();
          callChange(e);
          el.val('');
        });
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
    if (setting.reset) {
      const reset = $('<span>')
        .text('x')
        .addClass('reset')
        .click(() => {
          const def = getDefault(setting);
          el.val(def === null ? '' : def); // Manually change
          callChange({ target: el }); // Trigger change
          localStorage.removeItem(setting.key); // Remove
        });
      ret.append(' ', reset);
    }
    // TODO: show password button
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
      reset: data.reset === true,
    };
    if (Object.prototype.hasOwnProperty.call(settingReg, setting.key)) {
      debug(`settings.add: ${setting.name} already registered`);
      return false;
    }
    if (!data.type && data.options) {
      setting.type = 'select';
    }
    if (setting.type === 'slider') {
      setting.min = data.min || '0';
      setting.max = data.max || '100';
      setting.step = data.step || '1';
    }
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
      const prev = value(setting.key);
      if (val === undefined) {
        localStorage.removeItem(setting.key);
      } else {
        localStorage.setItem(setting.key, val);
      }
      if (typeof data.onChange === 'function') {
        data.onChange(value(setting.key), prev);
      }
      events.emit(setting.key, { val, prev });
      events.emit('setting:change', {
        key: setting.key, val, prev,
      });
    }
    setting.onChange = (el) => {
      let val = '';
      if (setting.type === 'boolean') {
        if (el.is(':checked')) val = 1;
        else if (setting.remove) val = undefined; // Only remove if it's expected
        else val = 0;
      } else if (['select', 'color', 'slider', 'text', 'password'].includes(setting.type)) {
        val = el.val();
      } else if (setting.type === 'remove') {
        val = undefined;
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
      update(val);
    };
    conf.settings[setting.key] = setting;
    if (!Object.prototype.hasOwnProperty.call(settingReg, setting.key)) {
      settingReg[setting.key] = setting;
    }
    return {
      key: setting.key,
      value: () => value(setting.key),
      set: update,
      on: (func) => {
        events.on(setting.key, func);
      },
    };
  }

  function buttons(page) {
    const btns = [];
    fn.each(configs, ({ name }, key) => {
      if (key === page) return;
      btns.push({
        label: name,
        action: (diag) => {
          diag.close();
          open(key);
        },
      });
    });
    btns.push({
      label: 'Close',
      action: close,
    });
    return btns;
  }

  function open(page = 'main') {
    if (typeof page !== 'string') throw new Error(`Attempted to open ${typeof page}`);
    const displayName = configs[page].name;
    global('BootstrapDialog').show({
      title: `UnderScript Configuration${page !== 'main' ? `: ${displayName}` : ''}`,
      message: getMessage,
      cssClass: 'mono underscript-dialog',
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
    if (!setting || setting.type === 'boolean') return val === '1' || val === 'true';
    if (setting.type === 'array') return JSON.parse(val);
    return val;
  }

  function getDefault(setting = {}) {
    if (setting.default) {
      const val = typeof setting.default === 'function' ? setting.default() : setting.default;
      if (setting.type === 'boolean') {
        return val !== 'false' && val !== '0' && Boolean(val);
      }
      return val;
    }
    if (setting.type === 'select') {
      return setting.options[0];
    }
    if (setting.type === 'array') {
      return [];
    }
    return null;
  }

  function remove(key) {
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
    const localSet = {};
    const extras = ['underscript.notice.', 'underscript.plugin.'];
    let used = false;
    fn.each(settingReg, (setting) => {
      if (!setting.exportable) return;
      const { key, extraPrefix } = setting;
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
    Object.entries(localStorage).forEach(([key, val]) => {
      if (Object.prototype.hasOwnProperty.call(localSet, key)) return;
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

  function importSettings(string) {
    try {
      // TODO
    } catch (e) {
      // TODO
    }
  }

  // Add our button last
  eventManager.on(':ready', () => {
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
      },
    });
  });

  // Main page is always first
  init('main');

  return {
    open,
    close,
    setDisplayName,
    isOpen,
    value,
    remove,
    register: add,
    on: (...args) => {
      events.on(...args);
    },
    export: exportSettings,
    import: importSettings,
  };
});
