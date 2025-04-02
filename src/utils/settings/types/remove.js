import Setting from './text.js';

export default class Remove extends Setting {
  constructor(name = 'remove') {
    super(name);
  }

  element(value, update, {
    removeSetting,
  }) {
    return $(`<input type="checkbox">`)
      .addClass('remove')
      .prop('checked', true)
      .on('change.script', (e) => removeSetting());
  }

  labelFirst() {
    return false;
  }

  styles() {
    return [
      '.remove { display: none; }',
      '.remove:checked + label:before { content: "× "; color: red; }',
    ];
  }
}
