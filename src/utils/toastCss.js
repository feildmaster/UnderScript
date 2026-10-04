import toArray from './toArray.js';

function apply(element, style) {
  const previous = {};
  if (!element || !style) return previous;
  Object.keys(style).forEach((key) => {
    const value = style[key];
    if (typeof value === 'object') return;
    previous[key] = element.style[key];
    element.style[key] = value;
  });
  return previous;
}

function hover(element, style) {
  if (!Object.keys(style).length) return;
  let previous = {};
  element.addEventListener('mouseenter', () => {
    previous = apply(element, style);
  });
  element.addEventListener('mouseleave', () => {
    apply(element, previous);
    previous = {};
  });
}

export default function applyToastCss({ element }, css, buttons) {
  const style = css || {};
  apply(element, style.toast || style);

  const title = element.querySelector('.simpletoast-title');
  if (title.hasChildNodes()) apply(title, style.title);
  const footer = element.querySelector('.simpletoast-footer');
  if (footer.hasChildNodes()) apply(footer, style.footer);

  const rendered = element.querySelectorAll('.simpletoast-button');
  toArray(buttons).filter((button) => button?.text).forEach((button, index) => {
    const target = rendered[index];
    if (!target) return;
    apply(target, style.button);
    apply(target, button.css);
    hover(target, { ...style.button?.mouseOver, ...button.css?.mouseOver });
  });
}
