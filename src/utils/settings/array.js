import Text from './text.js';

export default class ArrayType extends Text {
  constructor(name = 'array') {
    super(name);
  }

  value(data) {
    if (Array.isArray(data)) return data;
    return JSON.parse(data);
  }

  default() {
    return [];
  }

  element(value = [], update, {
    key,
    container,
  }) {
    function add(text) {
      $(container).append(createArrayItem(text, key, value, update));
    }
    value.forEach(add);
    return $('<input type="text">').css({
      'background-color': 'transparent',
    }).on('keydown.script', function keydown(e) {
      if (e.which !== 13) return; // If not "enter"
      e.preventDefault();
      value.push(this.value);
      add(this.value);
      this.value = '';
      update(value);
    });
  }

  styles() {
    return [
      'input.array-remove { display: none; }',
      'input.array-remove:checked + label:before { content: "× "; color: red; }',
    ];
  }
}

function createArrayItem(text, skey, value, update) {
  const key = `${skey}.${text}`;
  const ret = $('<div>')
    .on('change.script', () => {
      const i = value.indexOf(text);
      if (i > -1) {
        value.splice(i, 1);
        update(value);
      }
      ret.remove();
    });
  const el = $('<input>')
    .addClass('array-remove')
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
