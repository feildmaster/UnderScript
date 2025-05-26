import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global, globalSet } from 'src/utils/global.js';
import style from 'src/utils/style.js';
import * as fnUser from 'src/utils/user.js';
import { debug } from 'src/utils/debug.js';
import css from 'src/utils/css.js';
import Translation from 'src/structures/constants/translation.js';

const setting = settings.register({
  name: Translation.Setting('autocomplete'),
  key: 'underscript.autocomplete',
  default: true,
  page: 'Chat',
});

let current = false;
const lists = {};
style.add(
  // '.chat-footer { position: relative; }', // this bugs the chat
  css`
  .autobox {
    position: absolute;
    border: 1px solid #D4D4D4;
    border-bottom: none;
    border-top: none;
    bottom: 100%;
    left: 0;
    right: 0;
  }
  .autobox div {
    padding: 10px;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 90%);
    border-top: 1px solid #D4D4D4;
    border-bottom: 1px solid #D4D4D4;
  }
  .autobox div:hover {
    background-color: #666;
  }
  div.autobox-active {
    background-color: #333;
    color: #FFF;
  }
  `,
);

function autocomplete(input, room) {
  const list = lists[room];
  let el;

  function listener(event) {
    let el2;
    // If current word starts with @, show autocomplete
    const { text, replace } = getWord(this);
    closeList();
    if (text === undefined) return;
    debug(`"${text}"`);
    el = document.createElement('div');
    el.setAttribute('id', 'autobox');
    el.setAttribute('class', 'autobox');
    this.parentNode.appendChild(el);
    let x = 0;
    const localList = [...list];
    eventManager.emit('@autocomplete', {
      list: localList,
    });
    const listLength = localList.length;
    for (let i = 1; i <= listLength && x < 5; i++) { // Limit to 5 most recent entries
      /* check if the item starts with the same letters as the text field value: */
      const item = localList[listLength - i];
      if (item.substr(0, text.length).toUpperCase() !== text.toUpperCase()) continue;
      x += 1; // If we display this name, increment limit
      el2 = document.createElement('div');
      el2.innerHTML = `<strong>${item.substr(0, text.length)}</strong>${item.substr(text.length)}`;
      /* execute a function when someone clicks on the item value (DIV element) */
      el2.addEventListener('click', (e) => {
        replace(item);
        closeList();
      });
      el.appendChild(el2);
    }
    if (x === 0) return;
    current = 0;
    addActive(el.getElementsByTagName('div'));
  }

  input.addEventListener('input', listener);
  input.addEventListener('focus', listener);
  // input.addEventListener('blur', closeList); // TODO: Close autocomplete when not chatting
  input.addEventListener('keydown', (e) => {
    if (e.which === 39) return; // right (move into @)
    if (current === false) return;
    const x = el.getElementsByTagName('div');
    if (!x.length) return;
    let active = true;
    switch (e.which) {
      case 40: // down
        current += 1;
        break;
      case 38: // up
        current -= 1;
        break;
      case 13: // enter
      case 9: // tab
        x[current].click();
        active = false;
        break;
      case 37: // left
        // if moves before @
        return; // TODO
      case 27: // escape
        closeList(); // fallthrough
      default: return;
    }
    if (active) addActive(x);
    e.preventDefault();
  });
  function addActive(x) {
    if (!x) return;
    removeActive(x);
    if (current >= x.length) current = 0;
    if (current < 0) current = (x.length - 1);
    x[current].classList.add('autobox-active');
  }
  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autobox-active');
    }
  }
  function closeList() {
    current = false;
    if (!el) return;
    el.parentNode.removeChild(el);
    el = undefined;
  }
}

// FALL DOWN LOGIC: very important to not ruin
const boundaries = ['', ' '];
function getWord(input) {
  const text = input.value;
  let start = -1;
  let end = 0;

  if (text.includes('@')) {
    let x = text.indexOf(' ');
    if (x === -1) { // I'm not really sure why I'm special casing for spaces
      if (text.startsWith('@')) {
        start = 1;
        end = text.length;
      }
    }
    if (start === -1) { // TODO - Find the @ and any text following it
      const cursor = input.selectionStart;
      if (boundaries.includes(text.substring(cursor, cursor + 1))) {
        let str = text.substring(0, cursor);
        x = str.lastIndexOf('@');
        if (x > -1) {
          if (x === 0 || boundaries.includes(str[x - 1])) {
            str = str.substr(x + 1);
            if (!str.length || str[0] !== ' ' && str.indexOf(' ') === str.lastIndexOf(' ')) { // if immediate space, if more than 1 space, ignore it
              start = x + 1;
              end = cursor;
            }
          }
        }
      }
    }
  }

  if (start === -1) return {};

  function replace(str) {
    input.value = `${text.substring(0, start)}${str} ${text.substring(end)}`;
    input.selectionStart = start + str.length + 1;
    input.selectionEnd = input.selectionStart;
    input.focus();
  }
  return {
    replace,
    text: text.substring(start, end),
  };
}

function add(name, list) {
  if (!list || name === global('selfUsername')) return;
  const slot = list.indexOf(name);
  if (slot > -1) list.splice(slot, 1);
  list.push(name);
}

eventManager.on('Chat:getHistory', ({ room, history }) => {
  if (lists[room] === undefined) {
    lists[room] = [];
  }
  const list = lists[room];
  JSON.parse(history).forEach(({ user }) => add(fnUser.name(user), list));
  autocomplete($(`#${room} input.chat-text`)[0], room);
});
eventManager.on('Chat:getMessage', ({ room, chatMessage }) => {
  add(fnUser.name(JSON.parse(chatMessage).user), lists[room]);
});
eventManager.on('ChatDetected', () => {
  globalSet('autoComplete', function autoComplete(...args) {
    if (setting.value()) return;
    this.super(...args);
  }, {
    throws: false,
  });
});
