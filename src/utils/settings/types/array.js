import Setting from './setting.js';

export default class ArrayType extends Setting {
  constructor(name = 'array') {
    super(name);
  }

  value(data) {
    if (typeof data === 'string') return JSON.parse(data);
    return data;
  }

  default() {
    return [];
  }

  element(value, update, {
    key,
    container,
  }) {
    let index = 0;
    function add(text) {
      $(container).append(createArrayItem(text, `${key}.${index}`, value, update));
      index += 1;
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

function createArrayItem(text, key, value, update) {
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
