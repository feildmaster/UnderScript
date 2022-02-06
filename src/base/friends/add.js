import axios from 'axios';
import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { toast } from '../../utils/2.toasts';
import onPage from '../../utils/onPage';
import { decrypt } from '../../utils/decrypt.emails';
import * as $el from '../../utils/elementHelper';

const setting = settings.register({
  name: 'Add friends without refreshing',
  key: 'underscript.friend.add',
  default: true,
  page: 'Friends',
});

onPage('Friends', function addFriend() {
  const single = true;
  const input = document.querySelector('input[name="username"]');

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
          toast({
            text: `<p style="color: ${success ? 'green' : 'red'}">${success ? 'Sent' : 'Failed to send'} friend request to ${name}<p>`,
          });
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
    if ((e.keyCode || e.which) === 13 || [e.code, e.key].contains('Enter')) {
      if (submit() === false) e.preventDefault();
    }
  });
  document.querySelector('form[action="Friends"]').onsubmit = submit;
});
