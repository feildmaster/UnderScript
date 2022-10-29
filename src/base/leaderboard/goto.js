import eventManager from '../../utils/eventManager';
import { globalSet } from '../../utils/global';
import { debug } from '../../utils/debug';
import onPage from '../../utils/onPage';
import VarStore from '../../utils/VarStore';
import changePage from '../vanilla/pageSelect';

function set(type, value, replace = true) {
  if (history.state &&
    Object.prototype.hasOwnProperty.call(history.state, type) &&
    history.state[type] === value) return;
  const func = replace && !userLast() ? history.replaceState : history.pushState;
  const o = {};
  o[type] = value;
  func.call(history, o, document.title, `?${type}=${value}`);
}

function load({ page, user } = {}) {
  if (user) {
    $('#searchInput').val(user).submit();
  } else if (page !== undefined) {
    changePage(page);
  }
}

function getData() {
  const params = new URLSearchParams(location.search);
  return Object.fromEntries(params.entries());
}

function userLast() {
  return history.state && history.state.user;
}

if (onPage('leaderboard')) {
  const data = getData();
  const skip = VarStore(true);
  let replacePage;

  window.addEventListener('popstate', () => {
    if (!history.state) return;
    if (document.readyState === 'complete') load(history.state);
    else eventManager.on(':loaded', () => debug('!!!pop unready'), load(history.state));
  });

  eventManager.on('Rankings:selectPage', () => {
    replacePage = false;
  });
  eventManager.on('Rankings:init', () => load(data));

  eventManager.on(':loaded', () => {
    eventManager.on('ShowPage', function showPage(page) {
      if (skip.get()) return;
      set('page', page, replacePage);
      replacePage = undefined;
    });

    globalSet('findUserRow', function findUserRow(user) {
      const row = this.super(user);
      skip.set(row !== -1);
      set('user', user, false);
      return row;
    });
  });

  eventManager.on('Rankings:selectPage', () => {
    replacePage = false;
  });
}
