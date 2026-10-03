export default function ensureStylesheet(name, href) {
  const links = [...document.querySelectorAll('link[rel~="stylesheet"]')];
  if (links.some((link) => link.href.includes(name))) return false;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  const last = links.filter((el) => el.parentElement === document.head).pop();
  if (last) {
    last.after(link);
  } else {
    document.head.append(link);
  }
  return true;
}
