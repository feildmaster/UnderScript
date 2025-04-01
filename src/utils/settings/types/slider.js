import Text from './text.js';

// Extend text for basic "value" return
export default class Slider extends Text {
  constructor(name = 'slider') {
    super(name);
  }

  element(value, update, {
    data = {},
  }) {
    return $('<input>')
      .attr({
        type: 'range',
        min: data.min ?? '0',
        max: data.max ?? '100',
        step: data.step ?? '1',
      })
      .val(value)
      .on('change.script', (e) => update(e.target.value));
  }

  value(val) {
    if (Number.isNaN(val)) {
      return parseFloat(val);
    }
    return val;
  }

  styles() {
    return [
      '.flex-start input[type="range"] { flex-grow: 1; }',
      'input[type="range"] { display: inline; width: 200px; vertical-align: middle; }',
      // '.underscript-dialog input[type="range"]:after { content: attr(value); }',
    ];
  }
}
