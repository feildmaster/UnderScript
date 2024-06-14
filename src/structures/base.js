export default class Base {
  #id;

  constructor(data) {
    this.#id = data.id;
  }

  get id() {
    return this.#id;
  }

  update(data) {}

  toJSON() {
    return {
      id: this.id,
    };
  }
}
