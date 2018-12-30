// Check for script updates
(() => {
  const baseURL = 'https://unpkg.com/underscript/';
  const MINUTE = 60 * 1000, HOUR = 60 * MINUTE;
  const CHECKING = 'underscript.update.checking', LAST = 'underscript.update.last', DEBUG = 'underscript.debug.update', LATEST = 'underscript.update.latest';
  const base = axios.create({ baseURL });
  const latest = {
    set({version, unpkg}) {
      if (!version || !unpkg) return;
      localStorage.setItem(LATEST, JSON.stringify({
        version, unpkg,
        time: Date.now(),
      }));
    },
    del() {
      localStorage.removeItem(LATEST);
    },
    chk() {
      const latest = JSON.parse(localStorage.getItem(LATEST));
      if (latest) {
        return compareAndToast(latest);
      }
    },
  };
  let toast, updateToast;
  function check() {
    if (localStorage.getItem(CHECKING)) return false;
    localStorage.setItem(CHECKING, true);
    return base.get('package.json').then((response) => {
      localStorage.removeItem(CHECKING);
      localStorage.setItem(LAST, Date.now());
      return response;
    }).catch((error) => {
      localStorage.removeItem(CHECKING);
      fn.debug(error);
      if (toast) {
        toast.setText('Failed to connect to server.');
      }
    });
  }
  function noUpdateFound() {
    const ref = toast;
    if (ref && ref.exists()) {
      ref.setText('No updates available.');
      setTimeout(ref.close, 3000);
    }
  }
  function isNewer(data) {
    const version = GM_info.script.version;
    if ((version === 'L' || version.contains('-')) && !localStorage.getItem(DEBUG)) return false;
    if (data.time && data.time < GM_info.script.lastModified) return false;
    return data.version !== version;
  }
  function compareAndToast(data) {
    if (!isNewer(data)) {
      latest.del();
      return;
    }
    latest.set(data);
    updateToast = fn.toast({
      title: '[UnderScript] Update Available!',
      text: `Click here to update to version ${data.version}.`,
      onClose(reason) {
        if (reason !== 'dismissed') return;
        location.href = `${baseURL}${data.unpkg}`;
      },
    });
    return true;
  }
  function autoCheck() {
    if (latest.chk()) {
      // It passed, do nothing
      return;
    }
    const promise = check();
    if (!promise) return;
    debug('Auto checking for updates');
    promise.then(({data}) => {
      if (data) {
        compareAndToast(data);
      }
      // One hour from now or one minute from now (if an error occurred)
      setTimeout(autoCheck, data ? HOUR : MINUTE);
    })
  }
  // Frequency - when should it check for updates
  // Menu button - Manual update check
  menu.addButton({
    text: 'Check for updates',
    action() {
      if (updateToast && updateToast.exists()) return;
      if (toast) toast.close();
      toast = fn.toast({
        title: 'UnderScript updater',
        text: 'Checking for updates. Please wait.'
      });
      const promise = check();
      if (!promise) return;
      promise.then(({ data } = {}) => {
        if (!data) return;
        if (!isNewer(data)) {
          noUpdateFound();
        } else {
          toast.close(); // I need a wait to change the 'onclose'
          compareAndToast(data);
        }
      });
    },
    note() {
      const last = localStorage.getItem(LAST);
      return `Last Checked: ${last ? luxon.DateTime.fromMillis(parseInt(last)).toLocaleString(luxon.DateTime.DATETIME_FULL) : 'never'}`
    }
  });

  if (localStorage.getItem(LAST)) {
    const last = parseInt(localStorage.getItem(LAST));
    const now = Date.now();
    console.log(last, now, now < last + HOUR, now - last + HOUR);
    if (!last && now < last + HOUR) {
      autoCheck();
    } else {
      const timeout = now - last + HOUR;
      setTimeout(autoCheck, timeout);
    }
  }
  latest.chk();
})();
