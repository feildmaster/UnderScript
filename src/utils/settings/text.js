import SettingType from './setting';

export default class Text extends SettingType {
  constructor(name = 'text') { // Allow extending
    super(name);
  }

  value(val) {
    return val;
  }

  element(value, update) {
    return $('<input type="text">')
      .val(value)
      .on('blur.script', (e) => update(e.target.value))
      .css({
        'background-color': 'transparent',
      });
  }
}
