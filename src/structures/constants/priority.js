import * as api from 'src/utils/4.api.js';
import Constant from './constant.js';

export default class Priority extends Constant {
  static FIRST = new Priority('first', 'top');
  static HIGHEST = new Priority('highest');
  static HIGH = new Priority('high');
  static NORMAL = new Priority('normal');
  static LOW = new Priority('low');
  static LOWEST = new Priority('lowest');
  static LAST = new Priority('last', 'bottom');

  static get(value) {
    return this.find(value);
  }
}

api.mod.priority = Object.fromEntries(Object.entries(Priority));
