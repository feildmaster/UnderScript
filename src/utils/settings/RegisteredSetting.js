import EventEmitter from '../eventEmitter.js';
import SettingType from './types/setting.js';

export default class RegisteredSetting {
  /** @type {string} */
  #key;
  /** @type {string} */
  #name;
  /** @type {SettingType} */
  #type;
  /** @type {string} (or plugin) */
  #page;
  /** @type {string} */
  #category;
  /** @type {any} */
  #default;
  /** @type {boolean | Function} */
  #disabled;
  /** @type {boolean | Function} */
  #hidden;
  /** @type {boolean | Function} */
  #remove;
  /** @type {boolean | Function} */
  #export;
  /** @type {string} */
  #prefix;
  /** @type {boolean | Function} */
  #reset;
  #data;
  /** @type {string | Function} */
  #note;
  /** @type {boolean | Function} */
  #refresh;
  /** @type {Function} */
  #onChange;
  /** @type {EventEmitter} */
  #events;

  constructor({
    category,
    converter,
    data,
    default: def,
    disabled,
    export: exporting,
    extraPrefix,
    events,
    hidden,
    key,
    name,
    note,
    onChange,
    page,
    refresh,
    remove,
    reset,
    type,
  } = {}) {
    this.#key = key;
    this.#name = name || key;
    this.#type = type;
    this.#page = page;
    this.#category = category;
    this.#default = def;
    this.#disabled = disabled;
    this.#hidden = hidden;
    this.#remove = remove;
    this.#export = exporting;
    this.#prefix = extraPrefix;
    this.#reset = reset;
    this.#data = data;
    this.#note = note;
    this.#refresh = refresh;
    this.#onChange = onChange;
    this.#events = events;

    if (typeof converter === 'function') {
      this.#convert(converter);
    }
  }

  get key() {
    return this.#key;
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }

  get page() {
    return this.#page;
  }

  get category() {
    return this.#category;
  }

  get disabled() {
    return this.#value(this.#disabled) === true;
  }

  get hidden() {
    return this.#value(this.#hidden) === true;
  }

  get remove() {
    return this.#value(this.#remove) === true;
  }

  get exportable() {
    return this.#value(this.#export) !== false;
  }

  get extraPrefix() {
    return this.#prefix;
  }

  get reset() {
    return this.#value(this.#reset) === true;
  }

  get data() {
    return this.#data;
  }

  get note() {
    const notes = [];

    const note = this.#value(this.#note);
    if (note) {
      notes.push(note);
    }

    if (this.#value(this.#refresh)) {
      // TODO: Translation file
      notes.push('Will require you to refresh the page.');
    }

    return notes.join('<br>');
  }

  update(val) {
    const {
      key,
      type,
      value: prev,
    } = this;
    if (val === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, type.encode(val));
    }
    if (typeof this.#onChange === 'function') {
      this.#onChange(this.value, prev);
    }
    this.#events.emit(key, val, prev);
    this.#events.emit('setting:change', key, val, prev);
  }

  get value() {
    const val = localStorage.getItem(this.key);
    if (!val) {
      return this.default;
    }
    return this.type.value(val);
  }

  get default() {
    const val = this.#default;
    if (val !== undefined) {
      return this.type.value(this.#value(val));
    }
    return this.type.default(this.data);
  }

  #convert(converter) {
    const { key } = this;
    const current = localStorage.getItem(key);
    if (typeof current === 'string') {
      const converted = converter(current);
      if (converted === null) {
        localStorage.removeItem(key);
      } else if (converted !== undefined) {
        localStorage.setItem(key, converted);
      }
    }
  }

  #value(input) {
    if (typeof input === 'function') {
      return input();
    }

    return input;
  }
}
