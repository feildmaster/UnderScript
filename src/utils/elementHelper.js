function removeClass(el, className) {
  el.forEach((e) => e.classList.remove(className));
}

function containsText(el, text, { mutex, single } = {}) {
  if (el.forEach) {
    const ret = [];
    for (let i = 0; i < el.length; i++) {
      const element = mutex ? mutex(el[i]) : el[i];
      if (!!~getText(element).indexOf(text)) {
        ret.push(element);
      }
    }
    return single ? ret[0] : ret;
  }
  return !!~(el.textContent || el.innerText).indexOf(text);
}
function getText(el) {
  return el.value || el.textContent || el.innerText;
}
function setText(el, text) {
  const set = Object.getOwnPropertyDescriptor(el, 'textContent') ? 'textContent' : 'innerText';
  el[set] = text;
  return el;
}
function containsHTML(el, text, { mutex, single } = {}) {
  if (el.forEach) {
    const ret = [];
    for (let i = 0; i < el.length; i++) {
      const element = mutex ? mutex(el[i]) : el[i];
      if (!!~element.innerHTML.indexOf(text)) {
        ret.push(element);
      }
    }
    return single ? ret[0] : ret;
  }
  return !!~el.innerHTML.indexOf(text);
}
function setHTML(el, text) {
  el.innerHTML = text;
  return el;
}
function getHTML(el) {
  return el.innerHTML;
}

export const text = {
  contains: containsText,
  set: setText,
  get: getText,
};

export const html = {
  contains: containsHTML,
  set: setHTML,
  get: getHTML,
};

export default {
  removeClass,
  text,
  html,
};
