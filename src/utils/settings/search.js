import Translation from 'src/structures/constants/translation.js';
import { translateText } from 'src/utils/translate.js';

const decoder = document.createElement('template');

export default function createSearch(showSetting, settingReg, dialog) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('setting-search');

  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('setting-search-input');
  input.placeholder = translateText(Translation.General('search'));

  const results = document.createElement('ul');
  results.classList.add('setting-search-results');
  results.hidden = true;

  wrapper.append(input, results);

  let items = [];
  let activeIndex = -1;
  let exiting = false;

  function close() {
    results.hidden = true;
    results.replaceChildren();
    items = [];
    activeIndex = -1;
  }

  function highlight(index) {
    activeIndex = index;
    [...results.children].forEach((li, i) => li.classList.toggle('active', i === index));
  }

  function select(index) {
    const match = items[index];
    if (!match) return;
    showSetting(match.key, true);
    input.value = '';
    close();
  }

  function toText(html) {
    decoder.innerHTML = html;
    return decoder.content.textContent;
  }

  function pageLabel(page) {
    return toText(page.label || page.name || page);
  }

  function createResult(setting, index) {
    const item = document.createElement('li');
    const name = document.createElement('span');
    name.classList.add('setting-search-name');
    name.innerHTML = setting.name;
    const page = document.createElement('span');
    page.classList.add('setting-search-page');
    page.textContent = pageLabel(setting.page);
    item.append(name, page);
    item.addEventListener('mousedown', (e) => {
      e.preventDefault(); // fires before input's blur, so the click isn't lost
      select(index);
    });
    return item;
  }

  function search(query) {
    if (!query) return close();
    const q = query.toLowerCase();
    items = Object.values(settingReg)
      .filter((setting) => !setting.hidden && toText(setting.name).toLowerCase().includes(q))
      .slice(0, 10);

    if (!items.length) return close();

    results.replaceChildren(...items.map(createResult));
    results.hidden = false;
    highlight(0);
    return undefined;
  }

  input.addEventListener('input', () => search(input.value));

  input.addEventListener('focus', () => search(input.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (items.length) {
        close();
      } else {
        exiting = true;
      }
      return;
    }
    if (!items.length) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      search(input.value);
      if (!items.length) return;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'ArrowDown') {
      highlight((activeIndex + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      highlight((activeIndex - 1 + items.length) % items.length);
    } else {
      select(activeIndex);
    }
  });

  input.addEventListener('keyup', (e) => {
    if (e.key !== 'Escape') return;
    e.stopPropagation();
    if (!exiting) return;
    exiting = false;
    input.value = '';
    input.blur();
  });

  input.addEventListener('blur', () => setTimeout(close, 100));

  function hotkey(e) {
    if (e.key !== 'f' || !(e.ctrlKey || e.metaKey) || e.altKey) return;
    e.preventDefault();
    input.focus();
    input.select();
  }

  document.addEventListener('keydown', hotkey);
  dialog.onceClose(() => document.removeEventListener('keydown', hotkey));

  return {
    el: wrapper,
    focus: () => {
      input.focus();
      input.select();
    },
    reset: () => { input.value = ''; close(); },
  };
}
