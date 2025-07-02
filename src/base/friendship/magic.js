import axios from 'axios';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { toast } from 'src/utils/2.toasts.js';
import getLevel from 'src/utils/getFriendshipLevel.js';
import { buttonCSS as css } from 'src/utils/1.variables.js';
import Translation from 'src/structures/constants/translation.ts';

const setting = settings.register({
  name: Translation.Setting('friendship.notification'),
  key: 'underscript.disable.friendship.notification',
  page: 'Library',
  category: Translation.CATEGORY_FRIENDSHIP,
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
      title: Translation.Toast('friendship.notification'),
      text: `- ${items.join('\n- ')}`,
      className: 'dismissable',
      buttons: {
        text: Translation.General('go!'),
        className: 'dismiss',
        css,
        onclick: (e) => {
          location.href = '/Friendship';
        },
      },
    });
  });
}

eventManager.on('getVictory getDefeat', getFriendship);
