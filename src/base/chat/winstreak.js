settings.register({
  name: 'Announcement',
  key: 'underscript.winstreak',
  options: ['Chat', 'Toast', 'Both', 'Hidden'],
  default: 'Both',
  type: 'select',
  page: 'Chat',
  category: 'Winstreak'
});

settings.register({
  name: 'Friends Only',
  key: 'underscript.winstreak.friendsOnly',
  page: 'Chat',
  category: 'Winstreak'
});

wrap(() => {
  const empty = { close() {} }
  const toasts = {
    v: [],
    i: 0,
    add(toast) {
      (this.v[this.i] || empty).close();
      this.v[this.i] = toast;
      this.i = (this.i + 1) % 3;
      return toast;
    },
  };
  const regex = /(?:(.*) is on a (\d+))|(?:(.*) has just stopped (.*)'s (\d+))/;
  function friendsOnly() {
    return settings.value('underscript.winstreak.friendsOnly');
  }
  function checkFriend(name) {
    return !friendsOnly() || fn.isFriend(name);
  }
  function checkCount(amt) {
    //return parseInt(amt, 10) >= settings.value('underscript.winstreak.count');
    return true;
  }
  eventManager.on('preChat:getMessageAuto', function winstreaks({message: text}) {
    if (this.canceled || !~text.indexOf('game winning streak !')) return;
    const handling = settings.value('underscript.winstreak');
    if (handling === 'Chat' && !friendsOnly()) return; // All default
    this.canceled = handling !== 'Chat' && handling !== 'Both';
    if (handling === 'Hidden') return;
    const results = text.match(regex);
    const username = results[1] || results[4];
    const streak = results[2] || results[5];
    if (!checkFriend(username) || !checkCount(streak)) {
      this.canceled = true;
      return;
    }
    // At this point Toast is guaranteed
    const toast = toasts.add(fn.toast({
      text,
      //timeout: 10000,
      css: {
        color: 'yellow',
        footer: {color: 'white'},
      },
    }));
    toast.time = Date.now();
  });
}, 'winstreak');
