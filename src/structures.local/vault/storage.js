import Base from '../base.js';

export default class Storage extends Base {
  constructor(userId) {
    super({
      id: userId,
    });
  }

  get key() {
    return `underscript.deck.${this.id}`;
  }
}
