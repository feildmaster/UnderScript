import axios from 'axios';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { toast } from 'src/utils/2.toasts.js';
import onPage from 'src/utils/onPage.js';
import decrypt from 'src/utils/decrypt.emails.js';
import * as $el from 'src/utils/elementHelper.js';
import Translation from 'src/structures/constants/translation.ts';
import style from 'src/utils/style';

const setting = settings.register({
  name: Translation.Setting('friend.add'),
  key: 'underscript.friend.add',
  data: { reverse: true },
  page: 'Friends',
});

onPage('Friends', function addFriend() {
  const single = true;
  const input = document.querySelector('input[name="username"]');
  const sent = Translation.Toast('friend.request.sent');
  const failed = Translation.Toast('friend.request.failed');
  style.add('.green { color: green; }');

  function submit() {
    if (typeof URLSearchParams === 'undefined' || !setting.value()) return undefined;
    const name = input.value.trim();
    if (name) {
      input.value = '';
      input.focus();
      const params = new URLSearchParams();
      params.append('username', name);
      params.append('addFriend', 'Add friend');
      axios.post('/Friends', params).then((results) => {
        const page = new DOMParser().parseFromString(results.data, 'text/html').querySelector('div.mainContent');
        const result = page.querySelector('form[action="Friends"] + p');
        if (result) {
          const success = result.classList.contains('green');
          const text = success ? sent : failed;
          toast(text.withArgs(name));
          if (success) {
            const element = $el.text.contains(decrypt(page).querySelectorAll('a[href^="Friends?delete="]'), `${name} LV`, { mutex, single });
            $el.text.contains(document.querySelectorAll('p'), 'Pending requests', { single }).parentElement.append(element);
            eventManager.emit('newElement', element);
          }
        }
      });
    }
    return false;
  }
  function mutex(el) {
    return el.parentElement;
  }

  input.addEventListener('keydown', (e) => {
    if ([e.code, e.key].contains('Enter')) {
      if (submit() === false) e.preventDefault();
    }
  });
  document.querySelector('form[action="Friends"]').onsubmit = submit;
});
