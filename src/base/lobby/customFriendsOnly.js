import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global } from 'src/utils/global.js';
import { errorToast } from 'src/utils/2.toasts.js';
import { debug } from 'src/utils/debug.js';
import isFriend from 'src/utils/isFriend.js';
import Translation from 'src/structures/constants/translation';

const name = Translation.Setting('custom.friends');
const setting = settings.register({
  name,
  key: 'underscript.custom.friendsOnly',
  note: Translation.Setting('custom.friends.note'),
  page: 'Lobby',
  category: Translation.CATEGORY_CUSTOM,
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
  eventManager.on('underscript:ready', () => {
    $('label[for="friends"]').text(name);
  });
}

function joined({ username }) {
  if (this.canceled || !flag || isFriend(username)) return;
  debug(`Kicked: ${username}`);
  errorToast({
    title: Translation.Toast('custom.ban').translate(),
    text: Translation.Toast('custom.ban.user').translate(username),
  });
  this.canceled = true;
  global('banUser')();
}

eventManager.on('enterCustom', init);
eventManager.on('preCustom:getPlayerJoined', joined);
