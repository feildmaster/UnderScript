import Skin from '../card/skin.js';
import Item from '../constants/item.js';

export default class Reward {
  #reward;
  #type;

  constructor(el) {
    this.#reward = el;
  }

  get reward() {
    this.#process();
    return this.#reward;
  }

  get type() {
    this.#process();
    return this.#type;
  }

  #process() {
    if (!(this.#reward instanceof Element)) return;
    const { type, value } = rewardType(this.#reward);
    this.#reward = value;
    this.#type = type;
  }

  toJSON() {
    return {
      reward: this.reward,
      type: this.type,
    };
  }
}

function rewardType(el) {
  let temp = el.querySelector('[data-i18n-tips]');
  if (temp) { // Generic reward
    const type = temp.dataset.i18nTips;
    return {
      type: Item.find(type) || type,
      value: temp.parentElement.textContent.trim().substring(1),
    };
  }

  temp = el.querySelector('[data-i18n-custom="quests-ucp"]');
  if (temp) {
    return {
      type: Item.UCP,
      value: temp.dataset.i18nArgs,
    };
  }

  temp = el.querySelector('.card-skin-bordered');
  if (temp) {
    const { textContent: text } = temp.attributes.onmouseover;
    return {
      type: Item.CARD,
      value: text.substring(text.indexOf(',') + 1, text.indexOf(')')).trim(),
    };
  }

  temp = el.querySelector('[data-skin-type]');
  if (temp) {
    return {
      type: Item.SKIN,
      value: new Skin(temp.dataset),
    };
  }

  temp = el.querySelector('.avatar');
  if (temp) {
    return {
      type: Item.AVATAR,
      value: {
        image: temp.src,
        rarity: temp.classList[1],
      },
    };
  }

  temp = el.querySelector('[src*="/emotes/"]');
  if (temp) {
    return {
      type: Item.EMOTE,
      value: temp.src,
    };
  }

  temp = el.querySelector('[src*="/profiles/"]');
  if (temp) {
    return {
      type: Item.PROFILE,
      value: temp.src,
    };
  }

  throw new Error('unknown reward type');
}
