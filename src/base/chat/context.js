import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global } from '../../utils/global.js';
import style from '../../utils/style.js';
import { toast as simpleToast, infoToast } from '../../utils/2.toasts.js';
import each from '../../utils/each.js';
import * as fnUser from '../../utils/user.js';
import ignoreUser from '../../utils/ignoreUser.js';
import decode from '../../utils/decode.js';
import css from '../../utils/css.js';
import { buttonCSS, window } from '../../utils/1.variables.js';

const setting = settings.register({
  name: 'Disable Chat Context (right click)',
  key: 'underscript.disable.chatContext',
  page: 'Chat',
});

style.add(css`
  .chatContext {
    background-color: #F4F4F4;
    margin: 10px;
    color: #333;
    border: 1px dashed #000;
    position: absolute;
    z-index: 20;
    text-align: center;
    border-radius: 10px;
  }
  .chatContext header {
    padding: 0 5px;
    height: auto;
  }
  /* TODO: Why is this !important? */
  .chatContext select {
    background-color: transparent !important;
  }
  .chatContext li {
    list-style: none;
    margin: 0;
    padding: 3px;
    border-top: 1px solid #CCC;
    cursor: pointer;
  }
  .chatContext .disabled {
    background-color: #CCC;
    cursor: not-allowed;
  }
  .chatContext li:not(.disabled):hover {
    background-color: #036;
    color: #F2F2F2;
  }
  .chatContext > :last-child {
    border-radius: 0 0 10px 10px;
  }
`);
let toast;

eventManager.on('jQuery', () => {
  const ignorePrefix = 'underscript.ignore.';
  const context = (() => {
    const container = $('<div class="chatContext">');
    const profile = $('<li>Profile</li>');
    const message = $('<li>Message</li>');
    const ignore = $('<li>Ignore</li>');
    const mention = $('<li>Mention</li>');
    const mute = $('<li>Mute</li>');
    const muteTime = $('<select>');
    const header = $('<header>');
    container.append(header, profile, mention, ignore).hide();
    $('body').append(container);

    const times = {
      1: '1s',
      60: '1m',
      600: '10m',
      3600: '1h',
      21600: '6h',
      43200: '12h',
      86400: '1d',
    };
    each(times, (item, key) => {
      muteTime.append($(`<option value="${key}"${key === '3600' ? ' selected' : ''}>${item}</option>`));
    });
    mute.append(' ', muteTime);

    function open(event) {
      if (event.ctrlKey || setting.value()) return;
      if (toast) {
        toast.close('opened');
      }
      if (settings.value('underscript.disable.ignorechat')) {
        ignore.detach();
      } else {
        mention.after(ignore);
      }
      close();
      const { id, name, staff, mod } = event.data;
      const selfId = global('selfId');
      const selfMod = selfId !== id && global('selfMainGroup').priority <= 4;
      if (selfMod || global('isFriend')(id)) {
        profile.before(message);
      } else {
        message.detach();
      }
      event.preventDefault();
      if (selfMod) { // Add here to prevent a bug from happening
        container.append(mute);
      }
      // get top/left coordinates
      header.html(name);
      let left = event.pageX;
      const containerWidth = container.outerWidth(true);
      if (left + containerWidth > window.innerWidth) {
        left -= containerWidth;
      }
      container.css({
        top: `${event.pageY}px`,
        left: `${left}px`,
      });
      container.show();
      const disabled = staff || id === selfId;
      const muteDisabled = mod || id === selfId;
      container.on('click.script.chatContext', 'li', (e) => {
        if (!$(e.target).is('li')) {
          return;
        }
        if (e.target === profile[0]) {
          global('getInfo')(event.target);
        } else if (e.target === mention[0]) {
          const input = $(event.target).closest('.chat-box').find('.chat-text');
          let text = input.val();
          if (text.length !== 0 && text[text.length - 1] !== ' ') {
            text += ' ';
          }
          text += `@${decode(name)} `;
          input.val(text).focus();
        } else if (e.target === ignore[0]) {
          if (disabled) return; // If it's disabled it's disabled...
          const key = `${ignorePrefix}${id}`;
          if (!settings.value(key)) {
            simpleToast({
              text: `You've ignored ${name}`,
              css: {
                'background-color': 'rgba(208, 0, 0, 0.6)',
              },
              buttons: [{
                css: buttonCSS,
                text: 'Undo',
                className: 'dismiss',
                onclick: () => {
                  settings.remove(key);
                  updateIgnoreText(id);
                },
              }],
              className: 'dismissable',
            });
            ignoreUser(name, key, true);
          } else {
            settings.remove(key);
          }
          updateIgnoreText(id);
        } else if (e.target === mute[0]) {
          if (muteDisabled) return;
          global('timeout')(`${id}`, muteTime.val());
        } else if (e.target === message[0]) {
          global('openPrivateRoom')(id, name);
        }
        close();
      });
      if (disabled) {
        ignore.addClass('disabled');
      } else {
        ignore.removeClass('disabled');
      }
      if (muteDisabled) {
        mute.addClass('disabled');
        muteTime.prop('disabled', true);
      } else {
        mute.removeClass('disabled');
        muteTime.prop('disabled', false);
      }
      updateIgnoreText(id);
      $('html').on('mousedown.chatContext', (e) => {
        if ($(e.target).closest('.chatContext').length === 0) {
          close();
        }
      });
    }
    function updateIgnoreText(id) {
      if (settings.value(`${ignorePrefix}${id}`)) {
        ignore.html('Unignore');
      } else {
        ignore.html('Ignore');
      }
    }
    function close() {
      container.hide();
      container.off('.chatContext');
      $('html').off('chatContext');
    }
    return {
      open,
      close,
    };
  })();

  function processMessage(message, room) {
    const id = message.id;
    const user = message.user;

    let info = $(`#${room} #message-${id} #info-${user.id}`);
    if (!info.length) {
      info = $(`#${room} #message-${id} #info-${id}`);
    }
    info.on('contextmenu.script.chatContext', {
      name: fnUser.name(user),
      staff: user.mainGroup.priority <= 6,
      mod: user.mainGroup.priority <= 4,
      id: user.id,
    }, context.open);
  }

  eventManager.on('Chat:getHistory', (data) => {
    JSON.parse(data.history).forEach((message) => {
      processMessage(message, data.room);
    });
  });

  eventManager.on('Chat:getMessage', function parse(data) {
    if (this.canceled) return;
    processMessage(JSON.parse(data.chatMessage), data.room);
  });
});

eventManager.on('ChatDetected', () => {
  toast = infoToast({
    text: 'You can right click users in chat to display user options!',
    onClose: (reason) => {
      toast = null; // Remove from memory
      // return reason !== 'opened';
    },
  }, 'underscript.ignoreNotice', '1');
});
