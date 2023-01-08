import { global } from './global.js';

export default (element) => {
  element = element instanceof $ ? element : $(element);
  if ($.i18n) {
    global('translateElement')(element);
  }
  return element;
};

export function translateText(text) {
  if ($.i18n) {
    return $.i18n(text);
  }
  return text;
}
