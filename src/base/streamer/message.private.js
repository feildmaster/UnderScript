// Toast for private messages while streaming mode is on
wrap(function streamPM() {
  const busyMessage = ':me:is in do not disturb mode'; // TODO: configurable?
  const allow = 'Allow';
  const hide = 'Hide';
  const silent = 'Hide (silent)';
  const setting = settings.register({
    name: 'Private Messages',
    key: 'underscript.streamer.pms',
    options: [allow, hide, silent],
    default: hide,
    category: 'Streamer Mode',
  });

  const toasts = {};

  eventManager.on('preChat:getPrivateMessage', function streamerMode(data) {
    if (!script.streaming) return; // if not streaming

    const val = setting.value();
    if (val === allow || $(`#${data.room}`).length) return; // if private messages are allowed, if window is already open
    debug(data);

    const message = JSON.parse(data.chatMessage);
    const user = message.user;

    if (fn.user.isMod(user)) return; // Moderators are always allowed

    this.canceled = true; // Cancel the event from going through
    
    const userId = user.id;
    if (userId === global('selfId')) return; // ignore automated reply
    
    global('sendPrivateMessage')(busyMessage, userId); // send a message that you're busy
    if (val === silent) return close(user); // Close instantly when silent mode
    
    if (toasts[userId]) return; // Don't announce anymore
    const toast = toasts[userId] = fn.toast({
      text: `Message from ${user.username}`,
      buttons: [{
        css: {
          border: '',
          height: '',
          background: '',
          'font-size': '',
          'margin': '',
          'border-radius': '',
        },
        text: 'Open',
        className: 'dismiss',
        onclick: () => {
          open(user);
          toast.close('open');
        },
      },],
      onClose(type) {
        if (type === 'open') return;
        close(user);
      },
      className: 'dismissable',
    });
  });
  eventManager.on(':unload', closeAll);

  function open(user) {
    global('openPrivateRoom')(user.id, user.username.replace('\'', ''));
  }

  function close(user) {
    global('closePrivateRoom')(user.id);
  }

  function closeAll() {
    fn.each(toasts, t => t.close());
  }
});

