export default ({
  locale = 'en',
  id,
  data = [],
}) => {
  const l = $.i18n().locale;
  $.i18n().locale = locale;
  try {
    const text = $.i18n(id, ...data);
    return text;
  } catch {
    return 'ERROR';
  } finally {
    $.i18n().locale = l;
  }
};
