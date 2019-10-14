fn.translate = (element) => {
  element = element instanceof $ ? element : $(element);
  if ($.i18n) {
    global('translateElement')(element);
  }
  return element;
};

fn.translateText = (text) => {
  if ($.i18n) {
    return $.i18n(text);
  }
  return text;
};
