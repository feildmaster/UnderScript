import axios from 'axios';
import luxon from 'luxon';
import * as settings from '../../utils/settings/index.js';
import style from '../../utils/style.js';
import wrap from '../../utils/2.pokemon.js';
import { debugToast } from '../../utils/debug.js';
import { toast as BasicToast } from '../../utils/2.toasts.js';
import sleep from '../../utils/sleep.js';
import * as menu from '../../utils/menu.js';
import semver from '../../utils/version.js';
import { scriptVersion } from '../../utils/1.variables.js';
import css from '../../utils/css.js';
import { captureError } from '../../utils/sentry.js';

// Check for script updates
wrap(() => {
  const disabled = settings.register({
    name: 'Disable Auto Updates',
    key: 'underscript.disable.updates',
  });

  style.add(css`
    #AlertToast h2,
    #AlertToast h3 {
      margin: 0;
      font-size: 20px;
    }

    #AlertToast h3 {
      font-size: 17px;
    }
  `);
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
      return false;
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
      captureError(error);
      sessionStorage.removeItem(CHECKING);
      debugToast(error);
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
    if (version.includes('-')) return semver(data.version, version); // Allow test scripts to update to release
    return data.version !== version; // Always assume that the marked version is better
  }
  function compareAndToast(data) {
    if (!isNewer(data)) {
      latest.del();
      return false;
    }
    latest.set(data);
    if (updateToast) updateToast.close('stale');
    const path = `underscript@${data.version}/${data.unpkg}`;
    const baseStyle = {
      border: '',
      height: '',
      background: '',
      'font-size': '',
      margin: '',
      'border-radius': '',
    };
    updateToast = BasicToast({
      title: '[UnderScript] Update Available!',
      text: `Version ${data.version}.`,
      className: 'dismissable',
      buttons: [{
        text: 'Update (github)',
        className: 'dismiss',
        css: baseStyle,
      }, {
        text: 'Update (unpkg)',
        className: 'dismiss',
        css: baseStyle,
        onclick(e) {
          location.href = `${baseURL}/${path}`;
          updateToast.close('update');
        },
      }, {
        text: 'Update (jsdelivr)',
        className: 'dismiss',
        css: baseStyle,
        onclick: (e) => {
          location.href = `https://cdn.jsdelivr.net/npm/${path}`;
          updateToast.close('update');
        },
      }],
      onClose(reason) {
        if (reason !== 'dismissed') return;
        location.href = `https://github.com/UCProjects/UnderScript/releases/download/${data.version}/undercards.user.js`;
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
      toast = BasicToast({
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
