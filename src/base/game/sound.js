import eventManager from '../../utils/eventManager.js';
import * as settings from '../../utils/settings/index.js';
import { global, globalSet } from '../../utils/global.js';
import { getSeasonMonth } from '../../utils/season.js';

const baseVolumeSettings = { type: 'slider', page: 'Audio', max: 0.5, step: 0.01, default: 0.2, reset: true };
let active = false;

const enable = settings.register({
  name: 'Enable Audio Override',
  key: 'underscript.audio.override',
  default: true,
  page: 'Audio',
  note: 'Disabling this disables all other Audio settings!',
});

const aprilFoolsMusic = settings.register({
  name: 'Enable April Fools Music',
  key: 'underscript.audio.override.aprilFools',
  default: true,
  hidden: () => !isApril(),
  page: 'Audio',
});

const bgmEnabled = settings.register({
  name: 'Enable BGM',
  key: 'underscript.audio.bgm',
  default: () => !settings.value('gameMusicDisabled'),
  page: 'Audio',
  note: 'This setting overrides the game setting!',
  onChange(val) {
    if (!active) return;
    if (val) {
      overrideMusic(global('numBackground'));
    } else {
      pauseMusic();
    }
  },
});
const bgmVolume = settings.register({
  ...baseVolumeSettings,
  name: 'BGM volume',
  key: 'underscript.audio.bgm.volume',
  default: 0.1,
});
const resultEnabled = settings.register({
  name: 'Enable result music',
  key: 'underscript.audio.result',
  default: () => !settings.value('gameMusicDisabled'),
  page: 'Audio',
  note: 'This setting overrides the game setting!',
});
const resultVolume = settings.register({
  ...baseVolumeSettings,
  name: 'Result volume',
  key: 'underscript.audio.result.volume',
});
const soundEnabled = settings.register({
  name: 'Enable SFX',
  key: 'underscript.audio.sfx',
  default: () => !settings.value('gameSoundsDisabled'),
  page: 'Audio',
  note: 'This setting overrides the game setting!',
});
const soundVolume = settings.register({
  ...baseVolumeSettings,
  name: 'SFX volume',
  key: 'underscript.audio.sfx.volume',
});
const jingleEnabled = settings.register({
  name: 'Enable card jingles',
  key: 'underscript.audio.jingle',
  default: () => !settings.value('gameSoundsDisabled'),
  page: 'Audio',
  note: 'This setting overrides the game setting!',
});
const jingleVolume = settings.register({
  ...baseVolumeSettings,
  name: 'Card jingle volume',
  key: 'underscript.audio.jingle.volume',
});

function pauseMusic() {
  [global('music'), global('jingle')]
    .forEach((audio) => audio.pause());
}

function isApril() {
  return getSeasonMonth() === 4;
}

function enableAprilFools() {
  return isApril() && aprilFoolsMusic.value;
}

function overrideResult(name) {
  const data = { name, origin: name };
  const event = eventManager.cancelable.emit('playMusic', data);
  if (!resultEnabled.value() || !data.name || event.canceled) return;
  pauseMusic();
  if (!enable.value) {
    this.super(data.name);
    return;
  }
  const path = enableAprilFools() ? 'afm' : 'musics';
  createAudio(`/${path}/${data.name}.ogg`, {
    volume: resultVolume.value(),
    repeat: true,
    set: 'music',
  });
}
function overrideMusic(name) {
  const data = { name, origin: name };
  const event = eventManager.cancelable.emit('playBackgroundMusic', data);
  if (!bgmEnabled.value() || !data.name || event.canceled) return;
  pauseMusic();
  if (!enable.value) {
    this.super(data.name);
    return;
  }
  const path = enableAprilFools() ? 'afm' : 'musics';
  createAudio(`/${path}/themes/${data.name}.ogg`, {
    volume: bgmVolume.value(),
    repeat: true,
    set: 'music',
  });
}
function overrideSound(name) {
  const data = { name, origin: name };
  const event = eventManager.cancelable.emit('playSound', data);
  if (!soundEnabled.value() || !data.name || event.canceled) return;
  if (!enable.value) {
    this.super(data.name);
    return;
  }
  createAudio(`/sounds/${data.name}.wav`, {
    volume: soundVolume.value(),
    set: 'audio',
  });
}
function overrideJingle(name = '') {
  const data = { name, origin: name };
  const event = eventManager.cancelable.emit('playJingle', data);
  if (!jingleEnabled.value() || !data.name || event.canceled) return;
  pauseMusic();
  if (!enable.value) {
    this.super(data.name);
    return;
  }
  const path = enableAprilFools() ? 'afm' : 'musics';
  createAudio(`/${path}/cards/${data.name.replace(/ /g, '_')}.ogg`, {
    volume: jingleVolume.value(),
    set: 'jingle',
    listener: global('jingleEnd'),
  });
}

function createAudio(path, {
  volume = 0.2,
  repeat = false,
  set = '',
  listener,
  play = true,
}) {
  const audio = new Audio(path);
  audio.volume = parseFloat(volume);
  if (listener) {
    audio.addEventListener('ended', listener, false);
  } else if (repeat) {
    audio.addEventListener('ended', function ended() {
      this.currentTime = 0;
      this.play();
    }, false);
  }
  if (set) globalSet(set, audio);
  if (play) audio.play();
  return audio;
}

eventManager.on('connect', () => {
  active = true;
  // Override sound functions
  globalSet('playMusic', overrideResult);
  globalSet('playBackgroundMusic', overrideMusic);
  globalSet('playSound', overrideSound);
  globalSet('playJingle', overrideJingle);
});
