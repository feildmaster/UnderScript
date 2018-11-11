settings.register({
  name: 'Disable Chat Context (right click)',
  key: 'underscript.disable.chatContext',
});

eventManager.on('ChatDetected' , () => {
  let toast;

  const ignorePrefix = 'underscript.ignore.';
  const ignoreList = {};
  const context = (() => {
    function decode(string) {
      return $('<textarea>').html(string).val();
    }
    $('head').append($(`<style type="text/css">
        .chatContext { background: #F4F4F4; margin: 10px; color: #333; border: 1px dashed #000; position: absolute; z-index: 20; text-align: center; border-radius: 10px; }
        .chatContext header { padding: 0px 5px; height: auto; }
        .chatContext li {  list-style: none; margin: 0; padding: 3px; border-top: 1px solid #CCC; cursor: pointer; }
        .chatContext .disabled { background-color: #ccc; cursor: not-allowed; }
        .chatContext li:not(.disabled):hover { background-color: #003366; color: #F2F2F2; }
        .chatContext :last-child { border-radius: 0 0 10px 10px; }
      </style>`));
    const container = $('<div class="chatContext">');
    const profile = $('<li>Profile</li>');
    const ignore = $('<li>Ignore</li>');
    const mention = $('<li>Mention</li>');
    const header = $('<header>');
    container.append(header, profile, mention, ignore).hide();
    $('body').append(container);

    function open(event) {
      if (event.ctrlKey || localStorage.getItem('underscript.disable.chatContext')) return;
      if (toast) {
        toast.close();
      }
      close();
      const { id, name, staff } = event.data;
      event.preventDefault();
      // get top/left coordinates
      header.html(name);
      let left = event.pageX;
      const containerWidth = container.outerWidth(true);
      if (left + containerWidth > window.innerWidth) {
        left = left - containerWidth;
      }
      container.css({
        top: `${event.pageY}px`,
        left: `${left}px`,
      });
      container.show();
      const disabled = staff || id === selfId;
      container.on('click.script.chatContext', 'li', (e) => {
        if (e.target === profile[0]) {
          getInfo(event.target);
        } else if (e.target === mention[0]) {
          const input = $(event.target).closest('.chat-box').find('.chat-text');
          let text = input.val();
          if (text.length !== 0 && text[text.length - 1] !== ' ') {
            text += ' ';
          }
          text += decode(name) + ' ';
          input.val(text).focus();
        } else if (e.target === ignore[0]) {
          if (disabled) return; // If it's disabled it's disabled...
          if (!ignoreList.hasOwnProperty(id)) {
            ignoreList[id] = name;
            localStorage.setItem(`${ignorePrefix}${id}`, name);
          } else {
            localStorage.removeItem(`${ignorePrefix}${id}`);
          }
          updateIgnoreText(id);
        }
        close();
      });
      if (disabled) {
        ignore.addClass('disabled');
      } else {
        ignore.removeClass('disabled');
      }
      updateIgnoreText(id);
      $('html').on('mousedown.chatContext', (event) => {
        if ($(event.target).closest('.chatContext').length === 0) {
          close();
        }
      });
    }
    function updateIgnoreText(id) {
      if (ignoreList.hasOwnProperty(id)) {
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

  // Load Ingore List
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(ignorePrefix)) {
      ignoreList[key.substr(ignorePrefix.length)] = localStorage.getItem(key);
    }
  }

  function processMessage(message, room) {
    const id = message.id;
    const user = message.user;
    const name = user.username;

    let staff = false;
    user.groups.some((group) => {
      return staff = group.priority <= 6; // This is so hacky...
    });

    let info = $(`#${room} #message-${id} #info-${user.id}`);
    if (!info.length) {
      info = $(`#${room} #message-${id} #info-${id}`);
    }
    info.on('contextmenu.script.chatContext', {
        staff,
        name,
        id: user.id,
      }, context.open);
    
    if (!staff && user.id !== selfId && ignoreList.hasOwnProperty(user.id)) {
      $(`#${room} #message-${id} .chat-message`).html('<span class="gray">Message Ignored</span>').removeClass().addClass('chat-message');
    }
  }

  eventManager.on('Chat:getHistory', (data) => {
    JSON.parse(data.history).forEach((message) => {
      processMessage(message, data.room);
    });
  });

  eventManager.on('Chat:getMessage', (data) => {
    processMessage(JSON.parse(data.chatMessage), data.room);
  });

  toast = fn.infoToast({
    text: 'You can right click users in chat to ignore them!',
    onClose: () => {
      toast = null; // Remove from memory
    }
  }, 'underscript.ignoreNotice', '1');
});
