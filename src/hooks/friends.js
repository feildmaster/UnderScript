import axios from 'axios';
import eventManager from 'src/utils/eventManager.js';
import decrypt from 'src/utils/decrypt.emails.js';
import debug from 'src/utils/debugToast';
import sleep from 'src/utils/sleep.js';
import { window } from 'src/utils/1.variables.js';
import length from 'src/utils/length';

// Friends list hooks. TODO: only work if logged in
function getFromEl(el) {
  const link = el.find('a:first').attr('href');
  const id = link.substring(link.indexOf('=') + 1);
  const name = el.contents()[0].nodeValue.trim();
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
      // console.log(this);
      const f = getFromEl($(this));
      requests[f.id] = f.name;
    });
    const count = length(requests);
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

sleep().then(loadFriends);
