import axios from 'axios';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { toast } from 'src/utils/2.toasts.js';
import { debug } from 'src/utils/debug.js';
import onPage from 'src/utils/onPage.js';
import * as hover from 'src/utils/hover.js';
import each from 'src/utils/each.js';
import { captureError } from 'src/utils/sentry.js';
import Translation from 'src/structures/constants/translation.ts';

const disabled = settings.register({
  name: Translation.Setting('friend.auto'),
  key: 'userscript.autodecline.disable',
  page: 'Friends',
  category: Translation.CATEGORY_AUTO_DECLINE,
});

const silent = settings.register({
  name: Translation.Setting('friend.auto.silent'),
  key: 'underscript.autodecline.silent',
  default: true,
  page: 'Friends',
  category: Translation.CATEGORY_AUTO_DECLINE,
});

const chat = settings.register({
  name: Translation.Setting('friend.auto.ignore'),
  key: 'underscript.autodecline.ignored',
  default: true,
  page: 'Friends',
  category: Translation.CATEGORY_AUTO_DECLINE,
});

// Load blocked users
each(localStorage, (name, key) => {
  if (!key.startsWith('underscript.autodecline.user.')) return;
  register(key, name);
});

function register(key, name, set = false) {
  settings.register({
    key,
    name,
    type: 'remove',
    page: 'Friends',
    category: Translation.CATEGORY_AUTO_DECLINE,
  });
  if (set) {
    localStorage.setItem(key, name);
  }
}

function post(id, name) {
  axios.get(`/Friends?delete=${id}`).then(() => {
    if (!name) return;
    const message = Translation.Toast('friend.request.auto').translate(name);
    debug(message);
    if (!silent.value()) {
      toast(message);
    }
  }).catch(captureError);
}

function isBlocked(id) {
  return !!settings.value(`underscript.autodecline.user.${id}`);
}

function isIgnored(id) {
  return chat.value() && !!settings.value(`underscript.ignore.${id}`);
}

eventManager.on('preFriends:requests', function filter(requests) {
  if (disabled.value()) return;
  each(requests, (name, id) => {
    if (isBlocked(id) || isIgnored(id)) {
      debug(`Blocking ${name}[${id}]`);
      delete requests[id];
      post(id, name);
    }
  });
});

// Add a way to block users
onPage('Friends', function blockRequests() {
  eventManager.on('jQuery', () => {
    const block = $('<span class="material-icons md-light clickable">').css({
      'font-size': '14px',
    }).text('block');
    $('p:contains("Friend requests")').parent().find('li').each(function elements() {
      const el = $(this);
      const name = el.text().substring(0, el.text().lastIndexOf(' LV '));
      el.append(' ', block.clone().click(function onClick() {
        hover.hide();
        const link = el.find('a:first').attr('href');
        const id = link.substring(link.indexOf('=') + 1);

        register(`underscript.autodecline.user.${id}`, name, true);
        post(id);
        el.find('a[href^="Friends?"]').remove();
        el.addClass('deleted');
        $(this).remove();
      }).hover(hover.show(Translation.General('friend.block').withArgs(name))));
    });
  });
});
