// Check for script updates
wrap(() => {
  const disabled = settings.register({
    name: 'Disable Auto Updates',
    key: 'underscript.disable.updates',
  });

  style.add(
    '#AlertToast h2, #AlertToast h3 { margin: 0; font-size: 20px; }',
    '#AlertToast h3 {font-size: 17px; }',
  );
  const baseURL = 'https://unpkg.com/';
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const CHECKING = 'underscript.update.checking';
  const LAST = 'underscript.update.last';
  const DEBUG = 'underscript.debug.update';
  const LATEST = 'underscript.update.latest';
  const base = axios.create({ baseURL });
  const latest = {
    set({ version, unpkg }) {
      if (!version || !unpkg) return;
      localStorage.setItem(LATEST, JSON.stringify({
        version,
        unpkg,
        time: Date.now(),
      }));
    },
    del() {
      localStorage.removeItem(LATEST);
    },
    chk() {
      const stored = JSON.parse(localStorage.getItem(LATEST));
      if (stored) {
        return compareAndToast(stored);
      }
    },
  };
  let toast;
  let updateToast;
  let autoTimeout;
  function check() {
    if (sessionStorage.getItem(CHECKING)) return Promise.resolve();
    sessionStorage.setItem(CHECKING, true);
    return base.get(`underscript@latest/package.json`).then((response) => {
      sessionStorage.removeItem(CHECKING);
      localStorage.setItem(LAST, Date.now());
      return response;
    }).catch((error) => {
      sessionStorage.removeItem(CHECKING);
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
      sleep(3000).then(ref.close);
    }
  }
  function isNewer(data) {
    const version = scriptVersion;
    if (version === 'L' && !localStorage.getItem(DEBUG)) return false;
    if (data.time && data.time < GM_info.script.lastModified) return false; // Check if stored version is newer than script date
    if (version.includes('-')) return fn.semver(data.version, version); // Allow test scripts to update to release
    return data.version !== version; // Always assume that the marked version is better
  }
  function compareAndToast(data) {
    if (!isNewer(data)) {
      latest.del();
      return false;
    }
    latest.set(data);
    updateToast = fn.toast({
      title: '[UnderScript] Update Available!',
      text: `Version ${data.version}.`,
      footer: 'Click to update',
      onClose(reason) {
        if (reason !== 'dismissed') return;
        location.href = `${baseURL}/underscript@${data.version}/${data.unpkg}`;
      },
    });
    return true;
  }
  function autoCheck() {
    // It passed, don't need to check anymore
    if (latest.chk()) return;
    check().then(({ data } = {}) => {
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
        text: 'Checking for updates. Please wait.',
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
      const last = parseInt(localStorage.getItem(LAST), 10);
      return `Last Checked: ${last ? luxon.DateTime.fromMillis(last).toLocaleString(luxon.DateTime.DATETIME_FULL) : 'never'}`;
    },
  });

  function setupAuto() {
    if (disabled.value()) return;
    if (autoTimeout) clearTimeout(autoTimeout);
    const last = parseInt(localStorage.getItem(LAST), 10);
    const now = Date.now();
    const timeout = last - now + HOUR;
    if (!last || timeout <= 0) {
      autoCheck();
    } else {
      autoTimeout = setTimeout(autoCheck, timeout);
    }
  }

  sessionStorage.removeItem(CHECKING);
  if (!latest.chk()) setupAuto();
});
