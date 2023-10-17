import Base from '../base.js';

export default class Skin extends Base {
  #author;
  #card;
  #image;
  #name;
  #type;

  constructor({
    // Vanilla
    cardId = 0,
    skinAuthor = '',
    skinImage = '',
    skinName = '',
    skinType = 0,
    // Ours
    author = skinAuthor,
    card = cardId,
    image = skinImage,
    name = skinName,
    id = name || 0,
    type = skinType,
  }) {
    super({ id });
    this.#author = author;
    this.#card = Number(card);
    this.#image = image;
    this.#name = name;
    this.#type = Number(type);
  }

  get author() {
    return this.#author;
  }

  get authorName() { // Vanilla
    return this.#author;
  }

  get card() {
    return this.#card;
  }

  get cardId() { // Vanilla
    return this.#card;
  }

  get image() { // Vanilla
    return this.#image;
  }

  get imageSrc() {
    return `/images/cards/${this.image}.png`;
  }

  get name() {
    return this.#name;
  }

  get type() {
    // TODO: convert to constant
    return this.#type;
  }

  get typeSkin() { // Vanilla
    return this.#type;
  }

  toJSON() {
    return {
      author: this.author,
      card: this.card,
      image: this.image,
      src: this.imageSrc,
      name: this.name,
      type: this.type,
    };
  }
}
