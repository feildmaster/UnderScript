wrap(function() {
  if (!onPage('leaderboard')) return;
  const data = getData();
  const skip = new VarStore(true);
  let replacePage;

  function set(type, value, replace=true) {
    if (history.state && history.state.hasOwnProperty(type) && history.state[type] === value) return;
    const func = replace && !userLast() ? history.replaceState : history.pushState;
    const o = {};
    o[type] = value;
    func.call(history, o, document.title, `?${type}=${value}`);
  }

  window.addEventListener('popstate', () => {
    if (!history.state) return;
    if (document.readyState === 'complete') load(history.state);
    else eventManager.on(':loaded', ()=> debug('!!!pop unready'), load(history.state))
  });

  eventManager.on('Rankings:selectPage', () => replacePage = false);
  eventManager.on('Rankings:init', () => load(data));

  eventManager.on(':loaded', () => {
    globalSet('showPage', function (page) {
      this.super(page);
      if (skip.get()) return;
      set('page', page, replacePage);
      replacePage = undefined;
    });

    globalSet('findUserRow', function (user) {
      const row = this.super(user);
      skip.set(row !== -1);
      set('user', user, false);
      return row;
    });
  });

  eventManager.on('Rankings:selectPage', () => replacePage = false);
  
  function load({page, user} = {}) {
    if (user) {
      $('#searchInput').val(user).submit();
    } else if (page !== undefined) {
      fn.changePage(page);
    }
  }

  function getData() {
    const o = {}, d = decodeURIComponent;
    location.search.substring(1).replace(/([^=&]+)=([^&]*)/g, (m, k, v) => o[d(k)] = d(v));
    return o;
  }

  function userLast() {
    return history.state && history.state.user;
  }
});