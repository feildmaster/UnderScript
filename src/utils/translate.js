fn.translate = (element) => {
  element = element instanceof $ ? element : $(element);
  if ($.i18n) {
    return element.i18n();
  }
  return element;
};
