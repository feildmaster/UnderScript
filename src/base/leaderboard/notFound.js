import eventManager from '../../utils/eventManager.js';
import { globalSet } from '../../utils/global.js';
import { toast } from '../../utils/2.toasts.js';

const toasts = {};
eventManager.on(':loaded:leaderboard', () => {
  globalSet('findUserRow', function findUserRow(user) {
    const row = this.super(user);
    if (row === -1) {
      if (!toasts[user] || !toasts[user].exists()) {
        toasts[user] = toast({
          title: 'Not ranked',
          text: `Unfortunately ${user} has not qualified to be ranked, or the user does not exist.`,
        });
      }
    }
    return row;
  });
});
