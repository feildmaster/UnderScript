import Setting from './setting.js';

export default class extends Setting {
  constructor(name = 'boolean') { // Allows extension
    super(name);
  }

  value(val) {
    if (typeof val === 'boolean') return val;
    return ['1', 'true', 1].includes(val);
  }

  element(value, update, {
    remove = false,
  }) {
    return $(`<input type="checkbox">`)
      .prop('checked', value)
      .on('change.script', (e) => update(getValue(e.target, remove)));
  }

  default() {
    return false;
  }

  labelFirst() {
    return false;
  }
}

function getValue(el, remove = false) {
  if (el.checked) {
    return 1;
  }
  return remove ? undefined : 0;
}
