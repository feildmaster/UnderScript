export default class Constant {
  #value;
  constructor(value, ...rest) {
    if (rest.length) {
      this.#value = [value, ...rest];
    } else {
      this.#value = value;
    }
  }

  equals(other) {
    return this === other || valueEquals(this.#value, other);
  }

  toString() {
    return this.valueOf();
  }

  valueOf() {
    const value = this.#value;
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  }
}

function valueEquals(value, other) {
  const otherValue = other?.valueOf();
  if (Array.isArray(value)) {
    return value.includes(otherValue);
  }
  return value === otherValue;
}
