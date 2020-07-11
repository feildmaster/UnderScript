wrap(() => {
  function requestPermission() {
    if (window.Notification) {
      if (isType()) {
        return Notification.requestPermission();
      }
    }
    return Promise.resolve(false);
  }

  function isType(type = 'default') {
    return window.Notification && Notification.permission === type;
  }

  function notify(text, title = 'Undercards') {
    const n = new Notification(title, {
      body: text,
      icon: 'images/favicon.ico',
    });

    sleep(5000).then(() => n.close());
  }

  fn.notify = notify;

  if (isType() && !localStorage.getItem('underscript.notification.dismissPrompt')) {
    if (onPage('Play')) {
      eventManager.on(':load', () => toast('UnderScript would like to notify you when a game is found.'));
    }
  }

  function toast(text = 'UnderScript would like to send notifications.') {
    const css = {
      border: '',
      height: '',
      background: '',
      'font-size': '',
      margin: '',
      'border-radius': '',
    };
    const buttons = [{
      css,
      text: 'Request Permission',
      className: 'dismiss',
      onclick() {
        requestPermission().then((result) => {
          fn.toast(`Notifications ${result === 'granted' ? 'allowed' : 'denied'}`);
        });
      },
    }, {
      css,
      text: 'Dismiss',
      className: 'dismiss',
      onclick() {
        localStorage.setItem('underscript.notification.dismissPrompt', true);
      },
    }];
    fn.toast({
      buttons,
      text,
      className: 'dismissable',
    });
  }
});
