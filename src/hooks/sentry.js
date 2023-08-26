import eventManager from '../utils/eventManager.js';
import { init, login, logout } from '../utils/sentry.js';

if (typeof Sentry !== 'undefined') {
  init();

  eventManager.on('login', login);

  eventManager.on('logout', logout);
  // eventManager.on(':GuestMode', logout);
}
