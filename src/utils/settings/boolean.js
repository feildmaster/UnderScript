import SettingType from './setting.js';

export default class Boolean extends SettingType {
  constructor(name = 'boolean') { // Allows extension
    super(name);
  }

  value(val) {
    if (typeof val === 'boolean') return val;
    return val === '1' || val === 'true';
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
