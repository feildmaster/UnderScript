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
    return {
      type: getRewardType(temp.dataset.i18nTips),
      value: temp.parentElement.textContent.trim().substring(1),
    };
  }

  temp = el.querySelector('[data-i18n-custom="quests-ucp"]');
  if (temp) {
    return {
      type: 'UCP',
      value: temp.dataset.i18nArgs,
    };
  }

  temp = el.querySelector('.card-skin-bordered');
  if (temp) {
    const { textContent: text } = temp.attributes.onmouseover;
    return {
      type: 'card',
      value: text.substring(text.indexOf(',') + 1, text.indexOf(')')).trim(),
    };
  }

  temp = el.querySelector('[data-skin-type]');
  if (temp) {
    const { card, skinAuthor, skinImage, skinName, skinType } = temp.dataset;
    return {
      type: skinType === '0' ? 'card skin' : 'card skin full',
      value: {
        author: skinAuthor,
        card,
        image: `${location.origin}/images/cards/${skinImage}.png`,
        name: skinName,
      },
    };
  }

  temp = el.querySelector('.avatar');
  if (temp) {
    return {
      type: 'avatar',
      value: temp.src,
    };
  }

  temp = el.querySelector('[src*="/profiles/"]');
  if (temp) {
    return {
      type: 'profile',
      value: temp.src,
    };
  }

  temp = el.querySelector('.standard-skin');
  if (temp) {
    return {
      type: 'card skin',
      value: getStyleUrl(temp),
    };
  }

  temp = el.querySelector('.full-skin');
  if (temp) {
    return {
      type: 'card skin full',
      value: getStyleUrl(temp),
    };
  }

  throw new Error('unknown reward type');
}

function getStyleUrl(el) {
  const img = el.querySelector('cardImage');
  const style = img.currentStyle || window.getComputedStyle(img, true) || img.style;
  return style.backgroundImage.slice(4, -1).replace(/"/g, '');
}

function getRewardType(string) {
  switch (string) {
    // TODO: Convert to constants
    case 'reward-gold': return 'Gold';
    case 'reward-shiny-pack': return 'Shiny Pack';
    case 'reward-pack': return 'Pack';
    case 'reward-dr-pack': return 'DR Pack';
    case 'reward-dust': return 'Dust';
    case 'reward-dt-fragment': return 'DT Fragment';
    // If anything new comes through
    default: return string;
  }
}
