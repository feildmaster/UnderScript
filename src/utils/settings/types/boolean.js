import Setting from './setting.js';

export default class extends Setting {
  constructor(name = 'boolean') { // Allows extension
    super(name);
  }

  value(val, { extraValue, reverse = false } = {}) {
    if (typeof val === 'boolean') return val;
    const truthy = ['1', 'true', 1];
    if (extraValue) truthy.push(`${extraValue}`);
    const ret = truthy.includes(val);
    return reverse ? !ret : ret;
  }

  element(value, update, {
    remove = false,
  }) {
    return $(`<input type="checkbox">`)
      .prop('checked', value)
      .on('change.script', (e) => update(getValue(e.target, remove)));
  }

  default({ reverse } = {}) {
    return !!reverse;
  }

  labelFirst() {
    return false;
  }

  get isBasic() {
    return true;
  }
}

function getValue(el, remove = false) {
  if (el.checked) {
    return 1;
  }
  return remove ? undefined : 0;
}
