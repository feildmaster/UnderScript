import { translateText } from '../translate';
import Text from './text';

export default class Select extends Text {
  constructor(name = 'select') {
    super(name);
  }

  default([data] = []) {
    const [l, v = l] = Array.isArray(data) ? data : [data];
    return v;
  }

  element(value, update, {
    data = [],
  }) {
    return $('<select>')
      .append(options(data, value))
      .on('change.script', (e) => update(e.target.value));
  }
}

function options(data = [], current = '') {
  return data.map((o) => {
    const [l, v = l] = Array.isArray(o) ? o : [o];
    return `<option value="${v}"${current === v ? ' selected' : ''}>${translateText(l)}</option>`;
  });
}
