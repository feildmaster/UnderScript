wrap(() => {
  let showFriends = false;
  let ready = 0;
  const friendRanks = [];
  let pageNumber = -1;
  let btn;

  eventManager.once('Rankings:init', init);
  eventManager.once('Chat:Connected', () => {
    if (onPage('leaderboard')) init();
  });

  function toggle() {
    showFriends = !showFriends;
    localStorage.removeItem('rankedLeaderboardPage');
    global('setupLeaderboard')();
    if (btn) {
      btn.classList.toggle('active', showFriends);
    }
  }

  function init() {
    if (ready === -1) return;
    ready += 1;
    if (ready !== 2) return;
    ready = -1;

    style.add('#navButtons > .active > .glyphicon-user { color: orange; }');

    globalSet('getMaxPage', function getMaxPage() {
      if (showFriends) return Math.floor((friendRanks.length - 1) / global('maxDisplayPage'));
      return this.super();
    });

    eventManager.on('preShowPage', function showPage(page) {
      if (showFriends) {
        show(page);
        this.canceled = true;
      }
    });

    globalSet('getUserPageNum', function getUserPageNum() {
      if (showFriends) return pageNumber;
      return this.super();
    });

    btn = document.createElement('button');
    btn.classList.add('btn', 'btn-primary');
    btn.addEventListener('click', toggle);
    btn.innerHTML = '<span class="glyphicon glyphicon-user green"></span>';

    document.querySelectorAll('button.btn-lg').forEach((el) => el.classList.remove('btn-lg'));
    document.querySelector('#navButtons').append(btn);
    hover.new('Toggle friend rankings', btn);

    const leaderboard = global('leaderboard');
    const selfId = global('sessionIdUser');

    const selfIndex = leaderboard.findIndex(({ id }) => id === selfId);
    if (selfIndex >= 0) {
      pageNumber = Math.floor(selfIndex / global('maxDisplayPage'));
      global('userPageNumbers').push(pageNumber);
    }

    const friends = global('selfFriends');
    friendRanks.push(...leaderboard
      .filter(({ id }) => id === selfId || friends.some(({ id: uid }) => id === uid))
      .map((i) => leaderboard.indexOf(i)));
  }

  function show(page = 0) {
    $('.leaderboardSlot').remove();
    $('#btnSelf').prop('disabled', true);
    $('#btnNext').prop('disabled', page === global('getMaxPage')());
    const addSlot = global('addLeaderboardSlot');
    const max = global('maxDisplayPage');
    const start = page * max;
    friendRanks
      .slice(start, start + max)
      .forEach((row) => addSlot(row));
  }
});
