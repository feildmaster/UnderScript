/* eslint-disable camelcase */
import * as settings from 'src/utils/settings/index.js';
import { scriptVersion, window } from 'src/utils/1.variables.js';
import eventManager from 'src/utils/eventManager.js';

// This setting doesn't do anything, nor does the detection work.
// TODO: translation
settings.register({
  name: 'Send anonymous statistics',
  key: 'underscript.analytics',
  default: () => window.GoogleAnalyticsObject !== undefined,
  enabled: () => window.GoogleAnalyticsObject !== undefined,
  hidden: true,
  note: () => {
    if (window.GoogleAnalyticsObject === undefined) {
      return 'Analytics has been disabled by your adblocker.';
    }
    return undefined;
  },
});

const config = {
  app_name: 'underscript',
  app_version: scriptVersion,
  version: scriptVersion,
  // eslint-disable-next-line camelcase -- This shouldn't be needed???
  handler: GM_info.scriptHandler,
  anonymize_ip: true, // I don't care about IP addresses, don't track this
  custom_map: {
    dimension1: 'version',
  },
};
eventManager.on('login', (id) => {
  // This gives me a truer user count, by joining all hits from the same user together
  config.user_id = id;
});
window.dataLayer = window.dataLayer || [];
gtag('js', new Date());
gtag('config', 'G-32N9M5BWMR', config);

function gtag() {
  dataLayer.push(arguments); // eslint-disable-line no-undef, prefer-rest-params
}

export function send(...args) {
  if (!args.length) return;
  gtag('event', ...args);
}

export function error(description, fatal = false) {
  send('exception', { description, fatal });
}
