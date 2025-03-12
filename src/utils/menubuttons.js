import eventManager from './eventManager.js';
import style from './style.js';

let menu;

export default function addMenuButton(name, url) {
  if (!menu) return false;
  if (!name) throw new Error('Menu button must have a name');
  const el = document.createElement('li');

  const a = document.createElement('a');
  a.classList.add('click');
  a.innerHTML = name;
  if (url) {
    a.rel = 'noreferrer';
    a.href = url;
  }
  el.append(a);

  menu.append(el);
  return el;
}

eventManager.on(':preload', () => {
  menu = document.querySelector('ul.dropdown-menu[role="menu"]');
  if (!menu) return;
  style.add('.click {cursor: pointer;}');

  const divider = document.createElement('li');
  divider.classList.add('divider');

  const header = document.createElement('li');
  header.classList.add('dropdown-header');
  header.textContent = 'UnderScript';

  menu.append(divider, header);
});
