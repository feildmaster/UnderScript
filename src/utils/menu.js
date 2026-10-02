import Translation from 'src/structures/constants/translation.js';

import style from './style.js';
import { scriptVersion } from './1.variables.js';
import * as hover from './hover.js';
import eventManager from './eventManager.js';
import { infoToast } from './2.toasts.js';
import { debug } from './debug.js';
import addMenuButton from './menubuttons.js';
import { translateText } from './translate.js';
import compound from './compoundEvent.js';
import styles from './menu.css';

let initialized;
let menuOpen;
let wrapper;
let body;
let cooked;
let toast;
const buttons = [];

function init() {
  if (typeof initialized === 'boolean') return initialized;
  // jQuery must be initialized by now
  if (typeof jQuery === 'undefined') return initialized = false;
  style.add(styles);
  body = $('<div class="menu-body">');
  wrapper = $('<div class="menu-backdrop" tabindex="-1">')
    .append($('<div class="menu-content">')
      .attr({
        role: 'Menu',
      })
      .append(
        `<div class="menu-header"><span class="menu-close right">&times;</span>${Translation.Menu('menu.title')}</div>`,
        body,
        `<div class="menu-footer"><a href="https://git.io/fxysg" target="_blank">UnderScript</a> v${scriptVersion} <a href="https://discord.gg/D8DFvrU" target="_blank"><img id="usdiscord" src="images/social/discord.png" alt="discord"></a></div>`,
      ))
    .on('click', (e) => {
      if (e.target === wrapper[0]) {
        close();
      }
    });
  $('body').append(wrapper);
  $('span.menu-close').on('click', close);
  return initialized = true;
}
export function open() {
  if (menuOpen || !init()) return;
  eventManager.emit(':menu:opening');
  // Generate buttons
  if (!cooked) {
    body.html(''); // Clear current buttons
    buttons.forEach((data) => {
      if (data.hidden()) return;
      const button = $('<li>');
      button.attr({
        role: 'button',
        tabindex: 0,
      });
      if (data.url) {
        // Make text a url
      } else {
        button.text(translateText(data.getText()));
      }
      if (typeof data.action === 'function') {
        const callable = (e) => {
          if (typeof data.enabled !== 'function' || data.enabled()) {
            const result = data.action(e);
            if (result !== undefined ? result : data.close) {
              close();
            }
          } else {
            button.blur();
          }
        };
        button.on('click', callable)
          .on('keydown', (e) => {
            if (e.key !== ' ' && e.key !== 'Enter') return;
            e.preventDefault();
            callable(e);
          }).css({
            cursor: 'pointer',
          });
      }
      if (data.note) {
        if (typeof data.note === 'function') {
          button.on('mouseenter focus', (e) => {
            const note = data.note();
            if (note) {
              hover.show(note)(e);
            }
          }).on('mouseleave blur', hover.hide);
        } else if (typeof data.note === 'string') {
          button.on('mouseenter focus', hover.show(data.note))
            .on('mouseleave blur', hover.hide);
        }
      }
      body.append(button);
    });
    cooked = true;
  }
  wrapper.css({ display: 'block' }).focus();
  menuOpen = true;
  if (toast) {
    toast.close('opened');
  }
}
export function close() {
  if (!menuOpen) return;
  wrapper.css({ display: '' });
  menuOpen = false;
}
export function isOpen() {
  return menuOpen;
}
export function addButton(button = {}) {
  if (!button || !button.text) {
    debug('Menu: Missing button information');
    return;
  }
  const { text, action, url, note, enabled, hidden } = button;
  const safeButton = {
    action,
    url,
    note,
    enabled,
    close: button.keep !== true,
    getText: () => (typeof text === 'function' ? text() : text),
    hidden: () => typeof hidden === 'function' && hidden() || false,
  };
  if (button.top) {
    buttons.unshift(safeButton);
  } else {
    buttons.push(safeButton);
  }
  dirty();
}

compound(':load', 'underscript:ready', () => {
  const btn = addMenuButton(Translation.Menu('menu'));
  if (btn) btn.addEventListener('click', () => open());
  dirty();

  toast = infoToast({
    text: Translation.Toast('menu'),
    onClose: (reason) => {
      toast = null;
      // return reason !== 'opened';
    },
  }, 'underscript.notice.menu', '1');
});

export function dirty() {
  cooked = false;
}
