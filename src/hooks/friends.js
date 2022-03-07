import axios from 'axios';
import eventManager from '../utils/eventManager';
import decrypt from '../utils/decrypt.emails';
import { debugToast as debug } from '../utils/debug';
import sleep from '../utils/sleep';

// Friends list hooks. TODO: only work if logged in
function getFromEl(el) {
  const link = el.find('a:first').attr('href');
  const id = link.substring(link.indexOf('=') + 1);
  const name = el.text().substring(0, el.text().lastIndexOf(' LV '));
  return { id, name };
}

let validated = 0;

function loadFriends(validate) {
  if (typeof window.jQuery === 'undefined') return undefined;
  return axios.get('/Friends').then((response) => {
    const data = decrypt($(response.data));
    if (data.find(`span[data-i18n="[html]error-not-allowed"]`).length) {
      eventManager.singleton.emit(':GuestMode');
      return true;
    }
    const requests = {};
    // const pending = {};
    data.find('p:contains(Friend requests)').parent().children('li').each(function fR() {
      const f = getFromEl($(this));
      requests[f.id] = f.name;
    });
    const count = Object.keys(requests).length;
    if (count !== validated && count > 3 && !validate) {
      return loadFriends(count);
    }
    if (validate) {
      validated = count;
      if (validate !== count) debug(`Friends: Validation failed (found ${validate}, got ${count})`);
    }

    // eventManager.emit('Friends:pending', pending);
    eventManager.emit('preFriends:requests', requests);
    eventManager.emit('Friends:requests', requests);
    return false;
  }).catch((e) => {
    debug(`Friends: ${e.message}`);
  }).then((error) => {
    if (error) return;
    sleep(10000).then(loadFriends);
  });
}

sleep(10000).then(loadFriends);
