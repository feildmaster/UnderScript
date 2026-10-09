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

  static find(value) {
    if (value instanceof this) return value;
    return Object.values(this).find(
      (constant) => constant instanceof this && constant.equals(value),
    );
  }

  static lock() {
    Object.values(this).forEach((constant) => {
      if (constant instanceof this) Object.freeze(constant);
    });
    Object.freeze(this.prototype);
    Object.freeze(this);
  }
}
