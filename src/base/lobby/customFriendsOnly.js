import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { errorToast } from 'src/utils/2.toasts.js';
import { debug } from 'src/utils/debug.js';
import isFriend from 'src/utils/isFriend.js';

const setting = settings.register({
  name: 'Friends only',
  key: 'underscript.custom.friendsOnly',
  note: 'Setting this will only allow friends to join custom games by default.',
  page: 'Lobby',
  category: 'Custom',
});
const container = document.createElement('span');
let flag = setting.value();

function init() {
  $(container)
    .append($(`<input id="friends" type="checkbox">`).prop('checked', flag).on('change', () => {
      flag = !flag;
    }))
    .append(' ', $('<label for="friends">').text('Friends only'));
  // .hover(hover.show('Only allow friends to join'))
  $('#state2 span.opponent').parent().after(container);
  // hover.tip(`Only allow friends to join`, container);
}

function joined({ username }) {
  if (this.canceled || !flag || isFriend(username)) return;
  debug(`Kicked: ${username}`);
  errorToast({
    title: '[Match] Banned User',
    text: `'${username}' has been banned from custom match!`,
  });
  this.canceled = true;
  global('banUser')();
}

eventManager.on('enterCustom', init);
eventManager.on('preCustom:getPlayerJoined', joined);
