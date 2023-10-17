import Skin from './skin.js';
import isTruthish from '../../utils/isTrue.js';

export default class ShopSkin extends Skin {
  #active = false;
  #cost = 0;
  #discount = 0;
  #owned = false;
  #unavailable = false;

  constructor({
    // Vanilla
    ucpCost = 0,
    // Ours
    active,
    discount,
    owned,
    unavailable,
    cost = ucpCost,
    ...data
  }) {
    super(data);
    this.#active = isTruthish(active);
    this.#cost = Number(cost);
    this.#discount = Number(discount);
    this.#owned = isTruthish(owned);
    this.#unavailable = isTruthish(unavailable);
  }

  get active() {
    return this.#active;
  }

  get cost() {
    return this.#cost;
  }

  get discount() {
    return this.#discount;
  }

  get owned() {
    return this.#owned;
  }

  get unavailable() {
    return this.#unavailable;
  }
}
