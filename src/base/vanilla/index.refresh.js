wrap(() => {
  const setting = settings.register({
    name: 'Disable Game List Refresh',
    key: 'undercards.disable.lobbyRefresh',
    default: false,
    category: 'Home',
    init() {
      onPage('', setup);
    },
    onChange(val) {
      if (onPage('') && val) setup();
    },
  });

  let id;
  let refreshing = false;

  function clear() {
    if (id) {
      clearTimeout(id);
      id = null;
    }
  }

  function refresh() {
    clear();
    if (refreshing || document.visibilityState === 'hidden' || setting.value()) return;
    refreshing = true;
    axios.get('/').then((response) => {
      const data = fn.decrypt($(response.data));
      const list = data.find('#liste');
      const live = $('#liste');
      live.find('tbody').html(fn.translate(list.find('tbody')).html());
      live.prev('p').html(fn.translate(list.prev()).html());
    }).catch((e) => {
      fn.debug(`Index: ${e.message}`);
    }).then(() => {
      refreshing = false;
      setup();
    });
  }

  function setup(delay = 10000) {
    clear();
    id = setTimeout(refresh, delay);
  }

  onPage('', function refreshGameList() {
    // Restart refresh sequence when returning to page
    document.addEventListener('visibilitychange', refresh);
    // Queue initial refresh
    setup();
    fn.infoToast('The game list now refreshes automatically, every 10 seconds.', 'underscript.notice.refreshIndex', '1');
  });
});
