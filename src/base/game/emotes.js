import eventManager from '../../utils/eventManager';
import * as settings from '../../utils/settings';
import { global, globalSet } from '../../utils/global';
import { debug } from '../../utils/debug';
import onPage from '../../utils/onPage';
import compound from '../../utils/compoundEvent';

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

compound('GameStart', ':loaded', () => {
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
