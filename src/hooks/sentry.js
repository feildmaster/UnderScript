import eventManager from 'src/utils/eventManager.js';
import { init, login, logout } from 'src/utils/sentry.js';

if (typeof Sentry !== 'undefined') {
  init();

  eventManager.on('login', login);

  eventManager.on('logout', logout);
  // eventManager.on(':GuestMode', logout);
}
