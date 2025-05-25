/* eslint-disable no-multi-assign */
import axios from 'axios';
import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global, globalSet } from 'src/utils/global.js';
import style from 'src/utils/style.js';
import each from 'src/utils/each.js';

// Add setting to disable, or use top 500 (simple mode)
const disabled = 'No';
const setting = settings.register({
  name: 'Display Friendship Rankings',
  key: 'underscript.friendship.leaderboard',
  options: ['Yes', disabled],
  page: 'Library',
  category: 'Friendship',
});

const URI = 'Leaderboard?action=friendship&idCard=';
const HOUR = 60 * 60 * 1000;

const cache = {
  loaded: false,
  /*
  cardID: {
    baseline: int,
    timestamp: int,
    users: {
      id: {
        rank: int,
        xp: int,
      }
    },
  }
  */
};

function updateCache({
  card,
  user = global('selfId'),
  timestamp = Date.now(),
  base,
  xp,
  rank,
  save = false,
}) {
  if (!user) throw new Error('User missing');
  loadCache();

  const key = `${card};${user}`;
  const cachee = cache[key] = cache[key] || {};
  cachee.timestamp = timestamp;
  cachee.baseline = base || 0;

  if (xp && xp !== cachee.xp || rank !== cachee.rank) {
    cachee.xp = xp;
    cachee.rank = rank;
  }

  if (save) {
    saveCache();
  }

  return cachee;
}

function loadCache() {
  if (cache.loaded) return;

  const local = localStorage.getItem('underscript.cache.friendship');
  if (local) {
    const obj = JSON.parse(local);
    each(obj, (val, key) => {
      cache[key] = val;
    });
  }
  cache.loaded = true;
}

function saveCache() {
  const local = { ...cache };
  delete local.loaded;
  localStorage.setItem('underscript.cache.friendship', JSON.stringify(local));
}

function getCachedData(card, user) {
  if (!user) {
    throw new Error('User not provided!');
  }

  loadCache();

  const key = `${card};${user}`;
  const { xp, rank, baseline, timestamp } = cache[key] = cache[key] || {};
  return { xp, rank, baseline, timestamp };
}

function updateCacheCard(id, xp) {
  const user = global('selfId');
  const cached = getCachedData(id, user);

  const notExpired = cached.timestamp !== undefined && cached.timestamp > Date.now() - HOUR;
  const xpTooLow = cached.baseline !== undefined && xp < cached.baseline && !cached.rank;
  const xpSame = cached.xp !== undefined && xp === cached.xp && notExpired;

  // XP hasn't changed
  if (xpTooLow || xpSame) {
    cached.cached = true;
    return Promise.resolve(cached);
  }

  return axios.get(`${URI}${id}`).then((response) => {
    if (response.data) {
      const data = JSON.parse(response.data.leaderboard);
      const base = data[data.length - 1].xp;

      const rank = xp >= base ? data.findIndex(({ user: { id: userid } }) => userid === user) + 1 : 0;
      return updateCache({ card: id, user, rank, xp, base });
    }

    return getCachedData(id, user);
  });
}

function displayRank(card, rank) {
  $(`#${card} > .rank`).remove();
  if (rank > 0) {
    $(`#${card}`).append(`<div class="rank"${rank <= 5 ? ' top' : ''} val="${rank}"></div>`);
  }
}

// TODO: This needs to be hooked into leaderboard
// eventManager.on('updateFriendship', (data) => updateCache({ ...data, save: true }));

eventManager.on(':preload:Friendship', () => {
  style.add(
    `.rank {
      position: relative;
      z-index: 9;
      width: 32px;
      height: 32px;
      left: 76px;
      top: 99px;
      opacity: 0.9;
      background-image: url(images/friendship.png);
      background-repeat: no-repeat;
      background-position: center center;
    }`,
    `.rank:not([top])[val]::after {
      content: attr(val);
      font-size: 17px;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-shadow: -1px -1px 0 #000, 1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000;
    }`,
    `.rank[top]::after {
      content: ' ';
      background-repeat: no-repeat;
      background-position: center center;
      position: absolute;
      width: 100%;
      height: 100%;
    }`,
    '.rank[val="1"]::after { background-image: url(images/rarity/DELTARUNE_DETERMINATION.png); }',
    '.rank[val="2"]::after { background-image: url(images/rarity/DELTARUNE_LEGENDARY.png); }',
    '.rank[val="3"]::after { background-image: url(images/rarity/DELTARUNE_EPIC.png); }',
    '.rank[val="4"]::after { background-image: url(images/rarity/DELTARUNE_RARE.png); }',
    '.rank[val="5"]::after { background-image: url(images/rarity/DELTARUNE_COMMON.png); }',
  );

  const pending = [];
  let loaded = false;

  function pendingUpdate(id, xp) {
    if (loaded) {
      return updateCacheCard(id, xp);
    }

    return new Promise((res) => {
      eventManager.on('Chat:Connected', () => res(updateCacheCard(id, xp)));
    });
  }

  eventManager.on('Chat:Connected', () => {
    loaded = true;
  });

  eventManager.on('Friendship:page', () => {
    if (!pending.length) return;
    Promise.all(pending.splice(0))
      .then((vals = []) => {
        const notAllCached = vals.some((val) => !val);
        if (notAllCached) {
          saveCache();
        }
      });
  });

  globalSet('appendCardFriendship', function func(card, ...args) {
    const ret = this.super(card, ...args);
    if (setting.value() !== disabled) {
      const id = card.idCard || card.fixedId || card.id;
      pending.push(pendingUpdate(id, card.xp)
        .then(({ rank, cached }) => {
          displayRank(id, rank);
          return cached;
        }));
    }
    return ret;
  });
});
