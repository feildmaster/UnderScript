export default class Progress {
  #max;
  #value;

  constructor({
    max = 0,
    value = 0,
  } = {}) {
    this.#max = max;
    this.#value = value;
  }

  get max() {
    return this.#max;
  }

  get value() {
    return this.#value;
  }

  get complete() {
    return this.max === this.value;
  }

  compare(other) {
    if (!(other instanceof Progress)) throw new Error('invalid object');
    return Math.abs(this.value - other.value);
  }

  toJSON() {
    return {
      complete: this.complete,
      max: this.max,
      value: this.value,
    };
  }
}
