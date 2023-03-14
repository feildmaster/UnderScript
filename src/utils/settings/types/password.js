import Text from './text.js';

// TODO: show password button
export default class Password extends Text {
  constructor(name = 'password') {
    super(name);
  }

  element(value, update) {
    return $('<input type="password">')
      .val(value)
      .on('blur.script', (e) => update(e.target.value))
      .css({
        'background-color': 'transparent',
      });
  }
}
