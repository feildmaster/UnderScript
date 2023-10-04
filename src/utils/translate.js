import { global } from './global.js';

export default (element) => {
  element = element instanceof $ ? element : $(element);
  if ($.i18n) {
    global('translateElement')(element);
  }
  return element;
};

/**
 * @param {string} text text to translate
 * @param {string} fallback value to return when missing or translation not loaded
 * @returns {string} either translated text or fallback value
 */
export function translateText(text, fallback = text) {
  if (window.$?.i18n) {
    const val = $.i18n(text);
    if (val !== text) return val;
  }
  return fallback;
}
