export default function toLocale({
  locale = 'en',
  id,
  data = [],
}) {
  const l = $.i18n().locale;
  $.i18n().locale = locale;
  try {
    return $.i18n(`${id}`, ...data);
  } catch {
    return 'ERROR';
  } finally {
    $.i18n().locale = l;
  }
}

export function toEnglish(id, ...data) {
  return toLocale({ id, data });
}
