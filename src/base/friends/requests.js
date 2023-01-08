import axios from 'axios';
import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { toast } from '../../utils/2.toasts.js';
import each from '../../utils/each.js';
import { noop } from '../../utils/1.variables.js';

const setting = settings.register({
  name: 'Disable Friend Request Notifications',
  key: 'underscript.disable.friend.notifications',
  page: 'Friends',
});
eventManager.on('Friends:requests', (friends) => {
  if (setting.value()) return;
  // id: name
  // const newRequests = [];
  each(friends, (friend, id) => {
    const key = `underscript.request.${id}`;
    if (sessionStorage.getItem(key)) return;
    const css = {
      background: 'inherit',
    }; // I need to add a way to clear all styles
    toast({
      title: `Pending Friend Request`,
      text: friend,
      buttons: [{
        css,
        text: ' ',
        className: 'glyphicon glyphicon-ok green',
        onclick: post.bind(null, id),
      }, {
        css,
        text: ' ',
        className: 'glyphicon glyphicon-remove red',
        onclick: post.bind(null, id, false),
      }],
    });
    sessionStorage.setItem(key, friend);
  });
});
eventManager.on('logout', () => {
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('underscript.request.')) {
      sessionStorage.removeItem(key);
    }
  });
});

function post(id, accept = true) {
  const action = accept ? 'accept' : 'delete';
  axios.get(`/Friends?${action}=${id}`).then(() => {
    const key = `underscript.request.${id}`;
    const name = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    toast(`${accept ? 'Accepted' : 'Declined'} friend request from: ${name}`);
  }).catch(noop);
}
