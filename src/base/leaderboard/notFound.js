onPage('leaderboard', () => {
  const toasts = {};
  eventManager.on(':loaded', () => {
    globalSet('findUserRow', function (user) {
      const row = this.super(user);
      if (row === -1) {
        if (!toasts[user] || !toasts[user].exists()) {
          toasts[user] = fn.toast({
            title: 'Not ranked',
            text: `Unfortunately ${user} has not qualified to be ranked, or the user does not exist.`
          });
        }
      }
      return row;
    });
  });
});
