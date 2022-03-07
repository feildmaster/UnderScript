import each from '../../utils/each';
import eventManager from '../../utils/eventManager';
import { globalSet } from '../../utils/global';
import * as settings from '../../utils/settings';
import VarStore from '../../utils/VarStore';

const base = {
  key: 'underscript.safelink.',
  page: 'Chat',
  category: 'Trusted Domains',
};
const setting = settings.register({
  ...base,
  name: 'Enabled',
  default: true,
  key: 'underscript.enabled.safelink',
});

const safeLinks = new Set();

const cache = VarStore(false);

// Load blocked users
each(localStorage, (host, key) => {
  if (!key.startsWith(base.key)) return;
  register(host);
});

function register(host) {
  const s = settings.register({
    ...base,
    name: host,
    key: `${base.key}${host}`,
    type: 'remove',
  });
  if (s) {
    s.set(host);
    safeLinks.add(host);
  }
}

eventManager.on('BootstrapDialog:show', (dialog) => {
  if (dialog.getTitle() !== 'Leaving Warning' || !setting.value()) return;
  const host = cache.value;
  const after = dialog.options.buttons[0];
  dialog.options.buttons.unshift({
    label: `Trust ${host}`,
    cssClass: 'btn-danger',
    action(ref) {
      register(host);
      after.action(ref);
    },
  });
  dialog.updateButtons();
});

eventManager.on('ChatDetected', () => {
  globalSet('link', function link(l) {
    const url = new URL(l).hostname;
    // Undercards is a safe link :D
    if (setting.value() && (url === location.hostname || safeLinks.has(url))) return true;
    // Cache the url for later
    cache.value = url;
    return this.super(l);
  });
});
