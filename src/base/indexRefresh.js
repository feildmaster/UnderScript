onPage('', function refreshGameList() {
  let id;
  let refreshing = false;
  function refresh(timeout) {
    if (timeout) id = 0;
    if (refreshing || document.visibilityState === 'hidden') return;
    refreshing = true;
    axios.get('/').then((response) => {
      const data = $(response.data);
      const list = data.find('#liste');
      const live = $('#liste'); 
      live.find('tbody').html(list.find('tbody').html());
      live.prev('p').html(list.prev().html());
    }).catch((e) => {
      fn.debug(`Index: ${e.message}`);
    }).then(() => {
      refreshing = false;
      setup();
    });
  }

  function setup(delay = 10000) {
    if (id) {
      clearTimeout(id);
    }
    id = setTimeout(refresh, delay, true);
  }

  // Restart refresh sequence when returning to page
  document.addEventListener('visibilitychange', refresh);
  // Queue initial refresh
  setup();
  fn.infoToast('The game list now refreshes automatically, every 10 seconds.', 'underscript.notice.refreshIndex', '1');
});
