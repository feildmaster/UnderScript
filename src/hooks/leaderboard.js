wrap(() => {
  onPage('leaderboard', () => {
    eventManager.on(':loaded', () => {
      globalSet('pageName', location.pathname.substr(1));
      globalSet('action', 'ranked');
    });
    // TODO: Add other leaderboard hooks here?
  });
});
