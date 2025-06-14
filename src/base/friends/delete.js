import axios from 'axios';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { globalSet } from 'src/utils/global.js';
import { toast, errorToast } from 'src/utils/2.toasts.js';
import decrypt from 'src/utils/decrypt.emails.js';
import style from 'src/utils/style.js';
import { captureError } from 'src/utils/sentry.js';
import Translation from 'src/structures/constants/translation';

const setting = settings.register({
  name: Translation.Setting('friend.background'),
  key: 'underscript.removeFriend.background',
  default: true,
  page: 'Friends',
});

let reminded = false;

function remove(e) {
  if (!setting.value()) return;
  e.preventDefault();
  process($(this));
}

function process(btn) {
  const parent = btn.parent();
  btn.detach();
  const link = btn.attr('href');
  axios.get(link).then((response) => {
    const onlineFriends = $(response.data).find(`#onlineFriends`);
    if (!onlineFriends.length) {
      // TODO: translation
      errorToast('Try logging back in');
      return;
    }
    const found = decrypt(onlineFriends).find(`a[href="${link}"]`);
    if (found.length) {
      // TODO: translation
      toast(`Failed to remove: ${found.parent().find('span:nth-child(3)').text()}`);
      btn.appendTo(parent);
    } else {
      if (!reminded) {
        toast({
          // TODO: translation
          title: 'Please note:',
          text: 'Friends list will be updated upon refresh.',
        });
        reminded = true;
      }
      parent.addClass('deleted');
    }
  }).catch(captureError);
}

eventManager.on(':preload:Friends', () => {
  style.add('.deleted { text-decoration: line-through; }');
  $('a[href^="Friends?"]').click(remove);
  globalSet('updateFriends', function updateFriends() {
    this.super();
    $('a.crossDelete').click(remove);
  });
});
eventManager.on('newElement', (e) => $(e).find('a').click(remove));
eventManager.on('friendAction', process);
