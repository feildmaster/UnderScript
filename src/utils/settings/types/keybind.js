import { translateText } from 'src/utils/translate.js';
import Translation from 'src/structures/constants/translation';
import Text from './text.js';

const baseLabels = {
  ' ': 'Space',
};

const any = Translation.Setting('key.any');
const bind = Translation.Setting('key.bind');

export default class extends Text {
  constructor(name = 'keybind') {
    super(name);
  }

  element(value, update, {
    data = {},
    key: id,
  }) {
    const labels = {
      ...baseLabels,
      ...data.labels,
    };
    function getLabel(key) {
      return translateText(labels[key] || key);
    }
    let val = value !== 'Escape' ? value : '';
    let temp = getLabel(val);
    const ret = $('<div class="keybind-wrapper">');
    const input = $(`<input type="text" id="${id}">`)
      .val(temp)
      .on('focus', () => {
        input.val('').prop('placeholder', any);
        ret.addClass('editing');
      })
      .on('keydown', (event) => {
        const { key } = event;
        if (key !== 'Escape' && key !== val) {
          event.preventDefault();
          update(key);
          temp = getLabel(key);
          val = key;
        }
        input.blur();
      })
      .on('blur', () => {
        input.val(temp).prop('placeholder', bind);
        ret.removeClass('editing');
      })
      .prop('placeholder', bind);
    const button = $('<button class="glyphicon glyphicon-remove-sign">')
      .on('click', () => {
        if (temp === '') return;
        temp = '';
        input.val(temp);
        update(undefined);
      });
    ret.append(input, button);
    return ret;
  }

  styles() {
    return [
      '.keybind-wrapper { position: relative; }',
      '.keybind-wrapper input { text-align: center; caret-color: transparent; }',
      '.keybind-wrapper input:focus { border-color: transparent; outline: red double 1px; }',
      '.keybind-wrapper button { position: absolute; top: 4px; right: 0px; color: red; background-color: transparent; border: none; display: none;  }',
      '.keybind-wrapper:not(.editing):hover button { display: inline-block; }',
    ];
  }
}
