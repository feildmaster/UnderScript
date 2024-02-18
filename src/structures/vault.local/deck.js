import { global } from '../../utils/global.js';
import Base from '../base.js';

export default class Deck extends Base {
  /**
   * @type {import("./storage.js").default}
   */
  #owner;
  #soul;

  constructor(owner, soul = '', index = 0) {
    super({
      id: index,
    });
    this.#owner = owner;
    this.#soul = soul;
  }

  get key() {
    this.#checkLocal();
    return `${this.#owner.key}.${this.#soul}.${this.id}`;
  }

  get raw() {
    const cards = [{
      id: 0,
      shiny: false,
    }];
    const artifacts = [0];
    // Clear typings
    cards.shift();
    artifacts.shift();

    const data = JSON.parse(this.#getRaw());
    if (Array.isArray(data.cards)) {
      cards.concat(data.cards);
    }
    if (Array.isArray(data.artifacts)) {
      artifacts.concat(data.artifacts);
    }
    return {
      artifacts,
      cards,
      name: this.name,
      description: this.description,
    };
  }

  get name() {
    return this.#getRaw('name');
  }

  set name(to) {
    this.#setRaw('name', to);
  }

  get description() {
    return this.#getRaw('description');
  }

  set description(to) {
    this.#setRaw('description', to);
  }

  get cards() {
    return this.raw.cards;
  }

  get artifacts() {
    return this.raw.artifacts;
  }

  getCards() {
    const allCards = global('allCards', { throws: false });
    const cards = this.cards;

    if (!allCards) return cards;

    return cards.map(({ id, shiny }) => {
      const card = allCards.find((c) => c.id === id && c.shiny === shiny);
      if (!card) return {};
      return { ...card }; // TODO: use card structure
    });
  }

  getArtifacts() {
    const allArtifacts = global('allArtifacts', { throws: false });
    const artifacts = this.artifacts;

    if (!allArtifacts) return artifacts;

    const arts = artifacts.map((id) => {
      const artifact = allArtifacts.find(({ id: artID }) => artID === id);
      if (!artifact) return undefined;
      return { ...artifact }; // TODO: use artifact structure
    }).filter((_) => _); // Strip empty entries
    if (arts.length > 1) { // Only 1 legendary allowed
      const legend = arts.find(({ legendary }) => legendary);
      if (legend) return [legend];
    }
    return arts;
  }

  meta() {
    // TODO - Object that allows getting/setting of metadata items
    // this.getRaw(`meta.${key}`);
    // this.setRaw(`meta.${key}`, value);
  }

  #getRaw(key) { // TODO: Store all data in `${this.key}.meta`?
    this.#checkLocal();
    return localStorage.getItem(key ? `${this.key}.${key}` : this.key) ?? '';
  }

  #setRaw(key, value = null) {
    this.#checkLocal();
    const storageKey = key ? `${this.key}.${key}` : this.key;
    if (value === null) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, value);
    }
  }

  #checkLocal() {
    if (!this.#owner || !this.#soul || !this.id) throw new Error('Not a local deck');
  }
}
