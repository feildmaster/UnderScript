export default class Storage {
  constructor(userId) {
    this.owner = userId;
  }

  get key() {
    return `underscript.deck.${this.owner}`;
  }
}
