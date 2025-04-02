import Setting from './text.js';

export default class Color extends Setting {
  constructor(name = 'color') {
    super(name);
  }

  element(value, update) {
    return $('<input>').attr({
      type: 'color',
      value,
    }).on('change.script', (e) => update(e.target.value));
  }

  labelFirst() {
    return false;
  }

  styles() {
    return [
      'input[type="color"] { width: 16px; height: 18px; padding: 0 1px; }',
      'input[type="color"]:hover { border-color: #00b8ff; cursor: pointer; }',
    ];
  }
}
