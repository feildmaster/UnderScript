export default class Constant {
  #value;
  constructor(value, ...rest) {
    this.#value = [value, ...rest];
  }

  equals(other) {
    return this === other || this.#value.includes(other?.valueOf());
  }

  toString() {
    return this.valueOf();
  }

  valueOf() {
    return this.#value[0];
  }
}
