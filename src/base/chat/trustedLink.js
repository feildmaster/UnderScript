import Translation from 'src/structures/constants/translation';
import each from 'src/utils/each.js';
import eventManager from 'src/utils/eventManager.js';
import { globalSet } from 'src/utils/global.js';
import * as settings from 'src/utils/settings/index.js';
import VarStore from 'src/utils/VarStore.js';

const base = {
  key: 'underscript.safelink.',
  page: 'Chat',
  category: Translation.Setting('category.chat.links'),
};
const setting = settings.register({
  ...base,
  name: Translation.Setting('safelink'),
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

const TrustDomain = Translation.Setting('safelink.trust', 1);

eventManager.on('BootstrapDialog:show', (dialog) => {
  if (dialog.getTitle() !== 'Leaving Warning' || !setting.value()) return;
  const host = cache.value;
  const after = dialog.options.buttons[0];
  dialog.options.buttons.unshift({
    label: TrustDomain.withArgs('safelink.trust'),
    cssClass: 'btn-danger',
    action(ref) {
      register(host);
      after.action(ref);
    },
  });
  dialog.updateButtons();
});

eventManager.on('ChatDetected', () => {
  // Add current domain to safe links
  safeLinks.add(location.hostname);

  globalSet('link', function link(l) {
    const url = new URL(l).hostname;
    // Allow going to page instantly if it's marked as a safe link
    if (setting.value() && safeLinks.has(url)) return true;
    // Cache the url for later
    cache.value = url;
    return this.super(l);
  });
});
