import Reward from './Reward.js';
import Progress from './Progress.js';
import { translateText } from '../../utils/translate.js';
import Base from '../base.js';

export default class Quest extends Base {
  #args;
  #claimable = false;
  #key;
  #progress = new Progress();
  #reward = new Reward();

  constructor(data) {
    const id = isQuest(data) ? data.id : getId(data);
    super({ id });
    if (isQuest(data)) {
      this.#args = data.#args;
      this.#key = data.#key;
    } else if (data instanceof Element) {
      const el = data.querySelector('[data-i18n-custom^="quest"]');
      if (!el) throw new Error('Malformed quest');
      this.#args = el.dataset.i18nArgs?.split(',') || [];
      this.#key = el.dataset.i18nCustom;
    }
    this.update(data);
  }

  update(data) {
    if (data instanceof Element) {
      this.#claimable = data.querySelector('input[type="submit"][value="Claim"]:not(:disabled)') !== null;
      this.#progress = new Progress(data.querySelector('progress'));
      this.#reward = new Reward(data.querySelector('td:nth-last-child(2)'));
    } else if (isQuest(data)) {
      this.#claimable = data.claimable;
      this.#progress = data.progress;
      this.#reward = data.reward;
    }
  }

  get name() {
    return translateText(this.#key, {
      args: this.#args,
    });
  }

  get reward() {
    return this.#reward;
  }

  get progress() {
    return this.#progress;
  }

  get claimable() {
    return this.#claimable;
  }

  get claimed() {
    return !this.claimable && this.progress.complete;
  }

  clone() {
    return new Quest(this);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      reward: this.reward,
      progress: this.progress,
      claimable: this.claimable,
      claimed: this.claimed,
    };
  }
}

/**
 * @param {*} data
 * @returns {data is Quest}
 */
function isQuest(data) {
  return data instanceof Quest;
}

export function getId(element) {
  return element.querySelector('[name="questId"]')?.value ?? element.querySelector('[data-i18n-custom^="quest"]')?.dataset.i18nCustom;
}
