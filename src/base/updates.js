// Check for script updates
(() => {
  style.add(
    '#AlertToast h2, #AlertToast h3 { margin: 0; font-size: 20px; }',
    '#AlertToast h3 {font-size: 17px; }',
  );
  const baseURL = 'https://unpkg.com/';
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
  let toast, updateToast, autoTimeout;
  function check() {
    if (localStorage.getItem(CHECKING)) return Promise.resolve();
    localStorage.setItem(CHECKING, true);
    return base.get(`underscript@${getVersion()}/package.json`).then((response) => {
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
    const version = scriptVersion;
    if ((version === 'L' || version.includes('-')) && !localStorage.getItem(DEBUG)) return false;
    if (data.time && data.time < GM_info.script.lastModified) return false;
    return data.version !== version;
  }
  function compareAndToast(data) {
    if (!isNewer(data)) {
      latest.del();
      return;
    }
    latest.set(data);
    changelog.get(data.version, true).catch(() => null).then((changelog) => {
      updateToast = fn.toast({
        title: '[UnderScript] Update Available!',
        text: changelog || `Version ${data.version}.`,
        footer: 'Click to update',
        onClose(reason) {
          if (reason !== 'dismissed') return;
          location.href = `${baseURL}${data.unpkg}`;
        },
      });
    });
    return true;
  }
  function autoCheck() {
      // It passed, don't need to check anymore
    if (latest.chk()) return;
    check().then(({data} = {}) => {
      if (data) {
        compareAndToast(data);
      }
      // One hour from now or one minute from now (if an error occurred)
      autoTimeout = setTimeout(autoCheck, data ? HOUR : MINUTE);
    });
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
      check().then(({ data } = {}) => {
        setupAuto(); // Setup a new auto check (wait another hour)
        if (!data) return;
        if (!isNewer(data)) {
          noUpdateFound();
        } else {
          toast.close(); // I need a way to change the 'onclose'
          compareAndToast(data);
        }
      });
    },
    note() {
      const last = parseInt(localStorage.getItem(LAST));
      return `Last Checked: ${last ? luxon.DateTime.fromMillis(last).toLocaleString(luxon.DateTime.DATETIME_FULL) : 'never'}`
    }
  });

  function setupAuto() {
    if (autoTimeout) clearTimeout(autoTimeout);
    const last = parseInt(localStorage.getItem(LAST));
    const now = Date.now();
    const timeout = last - now + HOUR;
    if (!last || timeout <= 0) {
      autoCheck();
    } else {
      autoTimeout = setTimeout(autoCheck, timeout);
    }
  }

  function getVersion() {
    return scriptVersion.includes('-') ? 'next' : 'latest';
  }

  if (!latest.chk()) setupAuto();
})();
