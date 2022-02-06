import axios from 'axios';
import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { toast } from '../../utils/2.toasts';
import getLevel from '../../utils/getFriendshipLevel';

const setting = settings.register({
  name: 'Disable Friendship Notification',
  key: 'underscript.disable.friendship.notification',
  page: 'Library',
  category: 'Friendship',
});

const max = 200 / 5; // Limit level 200

function getFriendship() {
  if (setting.value()) return;
  axios.get('/FriendshipConfig').then((resp) => {
    const items = JSON.parse(resp.data.friendshipItems)
      .filter((item) => {
        const lvl = getLevel(item.xp);
        return lvl > 0 && item.claim < Math.min(Math.floor(lvl / 5), max);
      }).map((item) => $.i18n(`card-name-${item.idCard}`, 1));

    if (!items.length) return;

    toast({
      title: 'Pending Friendship Rewards',
      text: `- ${items.join('\n- ')}`,
      className: 'dismissable',
      buttons: {
        text: 'Go now!',
        className: 'dismiss',
        css: {
          border: '',
          height: '',
          background: '',
          'font-size': '',
          margin: '',
          'border-radius': '',
        },
        onclick: (e) => {
          location.href = '/Friendship';
        },
      },
    });
  });
}

eventManager.on('getVictory getDefeat', getFriendship);
