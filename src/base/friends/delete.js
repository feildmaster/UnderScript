import axios from 'axios';
import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { globalSet } from '../../utils/global';
import { toast, errorToast } from '../../utils/2.toasts';
import decrypt from '../../utils/decrypt.emails';
import style from '../../utils/style';

const setting = settings.register({
  name: 'Remove friends without refreshing',
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
      errorToast('Try logging back in');
      return;
    }
    const found = decrypt(onlineFriends).find(`a[href="${link}"]`);
    if (found.length) {
      toast(`Failed to remove: ${found.parent().find('span:nth-child(3)').text()}`);
      btn.appendTo(parent);
    } else {
      if (!reminded) {
        toast({
          title: 'Please note:',
          text: 'Friends list will be updated upon refresh.',
        });
        reminded = true;
      }
      parent.addClass('deleted');
    }
  }).catch(console.error);
}

eventManager.on(':loaded:Friends', () => {
  style.add('.deleted { text-decoration: line-through; }');
  $('a[href^="Friends?"]').click(remove);
  globalSet('updateFriends', function updateFriends() {
    this.super();
    $('a.crossDelete').click(remove);
  });
});
eventManager.on('newElement', (e) => $(e).find('a').click(remove));
eventManager.on('friendAction', process);
