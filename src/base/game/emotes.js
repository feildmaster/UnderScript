import eventManager from 'src/utils/eventManager.js';
import * as settings from 'src/utils/settings/index.js';
import { global, globalSet } from 'src/utils/global.js';
import { debug } from 'src/utils/debug.js';
import onPage from 'src/utils/onPage.js';
import compound from 'src/utils/compoundEvent.js';

// let live = false;
let self;
const spectating = onPage('Spectate');
const spectate = settings.register({
  name: 'Show when spectating',
  key: 'underscript.emote.spectate',
  default: true,
  page: 'Game',
  category: 'Emotes',
});
const friends = settings.register({
  name: 'Friends only',
  key: 'underscript.emote.friends',
  page: 'Game',
  category: 'Emotes',
});
const enemy = settings.register({
  name: 'Disable enemy',
  key: 'underscript.emote.enemy',
  page: 'Game',
  category: 'Emotes',
});

compound('GameStart', ':preload', () => {
  self = global('selfId', { throws: false });
  // live = true;
  if (disableSpectating()) {
    globalSet('gameEmotesEnabled', false);
    debug('Hiding emotes (spectator)');
  } else {
    const muteEnemy = enemy.value();
    globalSet('enemyMute', muteEnemy);
    if (muteEnemy) {
      debug('Hiding emotes (enemy)');
      $('#enemyMute').toggle(!spectating);
    }
  }
});

eventManager.on('getEmote:before', function hideEmotes(data) {
  // Do nothing if already disabled
  if (this.canceled || !global('gameEmotesEnabled')) return;
  if (friendsOnly(data.idUser)) {
    debug('Hiding emote (friends)');
    this.canceled = true;
  }
});

function disableSpectating() {
  return spectating && !spectate.value();
}

function friendsOnly(id) {
  return self && friends.value() && id !== self && !global('isFriend')(id);
}
